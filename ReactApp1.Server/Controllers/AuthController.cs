using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Entities;
using System.Text;
using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using System.Web;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.JsonPatch;
using ReactApp1.Server.Models.JWT;
using ReactApp1.Server.Models.User;
using ReactApp1.Server.Models.User.EditUser;
using System.Net.Http;
using System.Net.Http.Headers;
using Renci.SshNet.Messages;
using Humanizer;
using NuGet.Protocol;
using NuGet.Common;
using System.Net.Http.Formatting;
using Microsoft.DotNet.MSIdentity.Shared;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Net;
using ReactApp1.Server.Models.User.Response;
using Org.BouncyCastle.Ocsp;
using ReactApp1.Server.Models;
using System.Threading.Tasks;
using ReactApp1.Server.Services.Auth;
using Microsoft.AspNetCore.Identity.UI.Services;
using ReactApp1.Server.Services.Email;
using Microsoft.AspNetCore.WebUtilities;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService, IEmailService emailService) : ControllerBase
    {
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<Models.ErrorModel?>> Login(AuthUserDto request)
        {
            if (User.Identity.IsAuthenticated)
                return BadRequest(new ErrorModel("Már be vagy jelentkezve"));

            var tokenResponse = await authService.LoginAsync(request);
            if (tokenResponse.Error != null)
                return BadRequest(tokenResponse.Error);

            var user = await authService.GetUserByEmailAsync(request.email);
            if (user == null || !user.EmailConfirmed)
                return BadRequest(new ErrorModel("Erősítse meg email címét"));

            if (user.TwoFactorEnabled)
            {
                var tempToken = Guid.NewGuid().ToString();
                HttpContext.Session.SetString("2fa_userId", user.userID.ToString());
                HttpContext.Session.SetString("2fa_tempToken", tempToken);
                return Ok(new { Requires2FA = true, TempToken = tempToken });
            }

            authService.SetTokensInsideCookie(tokenResponse, HttpContext);
            await emailService.SendEmailAsync(user.email, "Belépés", "<h1>Sikeres bejelentkezés</h1>");
            return Ok();
        }


        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<Models.ErrorModel?>> Register(AuthUserDto request)
        {
            if (User.Identity.IsAuthenticated)
                return BadRequest(new ErrorModel("Már be vagy jelentkezve"));

            var token = await authService.RegisterAsync(request);
            if (token.Error != null)
                return BadRequest(token.Error);

            var user = await authService.GetUserByEmailAsync(request.email);
            if (user == null)
                return BadRequest(new ErrorModel("Hiba történt a regisztráció során"));

            var confirmationToken = await authService.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(confirmationToken));
            var confirmationLink = $"{Request.Scheme}://{Request.Host}/api/auth/confirm-email?userId={user.userID}&token={encodedToken}";

            await emailService.SendEmailAsync(
                user.email,
                "Erősítse meg email címét",
                $"<h1>Köszönjük regisztrációját!</h1><p>Kattintson <a href='{confirmationLink}'>ide</a> a megerősítéshez.</p>");

            return Ok(new ErrorModel("Regisztráció sikeres. Kérjük erősítse meg email címét."));
        }
        [AllowAnonymous]
        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] int userId, [FromQuery] string token)
        {
            try
            {
                var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
                var result = await authService.ConfirmEmailAsync(userId, decodedToken);

                return result
                    ? Ok(new ErrorModel("Email cím megerősítve!"))
                    : BadRequest(new ErrorModel("Érvénytelen vagy lejárt token."));
            }
            catch
            {
                return BadRequest(new ErrorModel("Hiba történt a megerősítés során."));
            }
        }
        [Authorize]
        [HttpPost("enable-2fa")]
        public async Task<ActionResult> Enable2FA()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await authService.GetUserAsync(userId);
            if (user == null) return NotFound();

            var secretKey = await authService.Generate2FATokenAsync(user);
            var recoveryCodes = await authService.Generate2FARecoveryCodesAsync(user);
            var qrCodeUrl = $"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/YourApp:{user.email}?secret={secretKey}&issuer=YourApp";

            await emailService.SendEmailAsync(
                user.email,
                "Kétlépcsős azonosítás beállítása",
                $"<h1>2FA beállítása</h1><p>Kód: <strong>{secretKey}</strong></p><img src='{qrCodeUrl}'/><h2>Helyreállító kódok:</h2><ul>{string.Join("", recoveryCodes.Select(c => $"<li>{c}</li>"))}</ul>");

            return Ok(new { secretKey, qrCodeUrl, recoveryCodes });
        }
        [AllowAnonymous]
        [HttpPost("complete-2fa-login")]
        public async Task<ActionResult> Complete2FALogin([FromBody] Complete2FALoginDto request)
        {
            var userId = HttpContext.Session.GetString("2fa_userId");
            var tempToken = HttpContext.Session.GetString("2fa_tempToken");

            if (string.IsNullOrEmpty(userId) || tempToken != request.TempToken)
                return BadRequest(new ErrorModel("Érvénytelen munkafolyamat"));

            var user = await authService.GetUserAsync(int.Parse(userId));
            if (user == null || !await authService.Verify2FATokenAsync(user, request.Code))
                return BadRequest(new ErrorModel("Érvénytelen kód"));

            HttpContext.Session.Remove("2fa_userId");
            HttpContext.Session.Remove("2fa_tempToken");

            var finalToken = await authService.CreateTokenResponse(user);
            authService.SetTokensInsideCookie(finalToken, HttpContext);
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("refresh-token")]
        public async void RefreshToken()
        {
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    return;
                }
                HttpContext.Request.Cookies.TryGetValue("refreshToken", out var refreshToken);
                var token = await authService.RefreshTokenAsync(refreshToken);
                if (token != null)
                {
                    authService.SetTokensInsideCookie(token, HttpContext);
                }
            }
            catch
            {
                return;
            }
            
        }


        [Authorize]
        [HttpGet("getUser")]
        public async Task<ActionResult<GetUserResponseObject?>> GetUser()
        {
            return Ok(new GetUserResponseObject(await authService.GetUserAsync(int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)))));
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("getUserAdmin/{id}")]
        public async Task<ActionResult<GetUserResponseObject?>> GetUserAdmin(int id)
        {
            return Ok(new GetUserResponseObject(await authService.GetUserAsync(id)));
        }


        [Authorize(Roles = "Admin")]
        [HttpPost("queryUsers")]
        public async Task<ActionResult<List<GetUserResponseObject?>>> QueryUsers(GetUserQueryFilter request)
        {
            List<User> users = await authService.GetQueryUsersAsync(request);
            var userResponses = new List<GetUserResponseObject>();
            foreach(User user in users)
            {
                if(user.accountStatus == 3)
                {
                    userResponses.Add(new GetUserResponseObject(user) { accountStatus = "Törölt" });
                }
                if (user.accountStatus == 2)
                {
                    userResponses.Add(new GetUserResponseObject(user) { accountStatus = "Felfüggesztett" });
                }
                if(user.accountStatus == 1)
                {
                    userResponses.Add(new GetUserResponseObject(user) { accountStatus = "Aktív" });
                }
                
            }
            return Ok(userResponses);
        }


        [Authorize]
        [HttpPatch("editUser")]
        public async Task<ActionResult<Models.ErrorModel>> EditUser(EditUserDto request)
        {
            int? id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if(id == null)
            {
                return BadRequest(new Models.ErrorModel("Hiba történt"));
            }
            var isSuccessful = await authService.EditUserAsync(request, (int)id);
            return isSuccessful == true ? Ok(new Models.ErrorModel("Sikeres frissítés")) : BadRequest(new Models.ErrorModel("Az email cím nem megfelelő, nem történt változás"));
        }


        [Authorize(Roles = "Admin")]
        [HttpPatch("editUserAdmin")]
        public async Task<ActionResult<Models.ErrorModel?>> EditUserAdmin(EditUserAdminDto request)
        {
            if(request.role == "Admin"){
                return StatusCode((int)HttpStatusCode.Forbidden, new Models.ErrorModel("Az admininsztátor fiókok nem módosíthatják a többi adminisztrátor fiókot"));
            }
            var isSuccessful = await authService.EditUserAdminAsync(request);
            return isSuccessful == true ? Ok(new Models.ErrorModel("Sikeres frissítés")) : BadRequest(new Models.ErrorModel("Nem megfelelő értékek lettek megadva, nem történt változás"));
        }


        [Authorize]
        [HttpPatch("editPassword")]
        public async Task<ActionResult<Models.ErrorModel?>> EditPassword(EditPasswordDto request)
        {
            int? id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (id == null)
            {
                return BadRequest("Hiba történt");
            }
            var isSuccessful = await authService.EditPasswordAsync(request, (int)id);
            return isSuccessful == true ? Ok(new Models.ErrorModel("Sikeres frissítés")) : BadRequest("A megadott jelszó nem megfelelő, nem történt változás");
        }


        [AllowAnonymous]
        [HttpPost("checkIfLoggedIn")]
        public async Task<ActionResult<LoginState>> CheckIfLoggedIn()
        {
            if (User.Identity.IsAuthenticated)
            {
                var resp = await authService.checkIfStatusChanged(User);
                if (resp)
                {
                    await authService.logout(HttpContext);
                    return Ok(new LoginState(false));
                }
                return Ok(new LoginState(true));
            }
            return Ok(new LoginState(false));
        }


        [Authorize]
        [HttpDelete("logout")]
        public async Task<ActionResult> Logout()
        {
            await authService.logout(HttpContext);
            return Ok();
        }


        [AllowAnonymous]
        [HttpPost("checkIfAdmin")]
        public ActionResult<LoginState> CheckIfAdmin()
        {
            if (User.Identity.IsAuthenticated && User.FindFirstValue(ClaimTypes.Role)=="Admin")
            {
                return Ok(new LoginState(true));
            }
            return Ok(new LoginState(false));
        }
        [Authorize]
        [HttpDelete("deleteUser/{id}")]
        public async Task<ActionResult<Models.ErrorModel?>> DeleteUser(int id)
        {
            ErrorModel? err;
            var a = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int uid);
            if (a && (User.FindFirstValue(ClaimTypes.Role) == "Admin" || uid == id))
            {
                err = await authService.deleteUser(id);

            }
            else
            {
                err = new ErrorModel("Nincs jogosultsága törölni ezt a fiókot");
            }
            if (err.errorMessage == "Sikeres törlés")
            {
                if(uid == id)
                {
                    await authService.logout(HttpContext);
                }
                return Ok(err);
            }
            return BadRequest(err);
        }
    }
}
