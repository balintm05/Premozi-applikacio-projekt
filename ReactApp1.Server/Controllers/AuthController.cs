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
        public async Task<ActionResult> Login(AuthUserDto request)
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
                var success = await authService.StartEmail2FAFlowAsync(user.userID);
                if (!success)
                    return StatusCode(500, new ErrorModel("Nem sikerült elindítani a 2FA folyamatot"));

                return Ok(new
                {
                    success = true,
                    requires2FA = true,
                    userId = user.userID
                });
            }

            await authService.SetTokensInsideCookie(tokenResponse, HttpContext);
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<Models.ErrorModel?>> Register(AuthUserDto request, [FromQuery] string frontendHost)
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
            var host = !string.IsNullOrEmpty(frontendHost) ? frontendHost : $"{Request.Scheme}://{Request.Host}";
            var confirmationLink = $"{host}/auth/confirm-email?userId={user.userID}&token={encodedToken}";

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
                if (result)
                {
                    var jwttoken = await authService.CreateTokenResponse(await authService.GetUserAsync(userId));
                    await authService.SetTokensInsideCookie(jwttoken,HttpContext);
                    return Ok(new ErrorModel("Email cím megerősítve!"));
                }
                else
                {
                    return BadRequest(new ErrorModel("Érvénytelen vagy lejárt token."));
                }
            }
            catch
            {
                return BadRequest(new ErrorModel("Hiba történt a megerősítés során."));
            }
        }
        [AllowAnonymous]
        [HttpPost("verify-email-2fa")]
        public async Task<ActionResult> VerifyEmail2FA([FromBody] VerifyEmail2FADto request)
        {
            bool isValid = await authService.VerifyEmail2FACodeAsync(request.UserId, request.Code);
            if (!isValid)
                return BadRequest(new ErrorModel("Érvénytelen vagy lejárt kód"));

            var user = await authService.GetUserAsync(request.UserId);
            if (user == null)
                return BadRequest(new ErrorModel("Érvénytelen felhasználó"));

            var finalToken = await authService.CreateTokenResponse(user);
            await authService.SetTokensInsideCookie(finalToken, HttpContext);

            return Ok();
        }
        [AllowAnonymous]
        [HttpPost("resend-2fa-code")]
        public async Task<ActionResult> Resend2FACode()
        {
            if (HttpContext.Session == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new ErrorModel("Session not available"));
            }
            var userId = HttpContext.Session.GetString("2fa_userId");
            if (string.IsNullOrEmpty(userId))
                return BadRequest(new ErrorModel("No active 2FA session"));

            var user = await authService.GetUserAsync(int.Parse(userId));
            if (user == null) return NotFound();

            var code = new Random().Next(100000, 999999).ToString();
            await authService.StoreEmail2FACodeAsync(user.userID, code, 5);

            await emailService.SendEmailAsync(
                user.email,
                "Új 2fa kód",
                $"<h3>Új 2fa kód: <strong>{code}</strong></h3>");

            return Ok();
        }
        [Authorize]
        [HttpPost("enable-email-2fa")]
        public async Task<ActionResult> EnableEmail2FA()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var success = await authService.EnableEmail2FAAsync(userId);

            return success
                ? Ok(new { success = true, message = "Kétlépcsős azonosítás engedélyezve" })
                : BadRequest(new { success = false, message = "Nem sikerült engedélyezni a 2FA-t" });
        }

        [Authorize]
        [HttpPost("disable-email-2fa")]
        public async Task<ActionResult> DisableEmail2FA([FromBody] Disable2FADto dto)
        {
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var isAdmin = User.IsInRole("Admin");

            if (dto.UserId != currentUserId && !isAdmin)
                return Forbid();

            var passwordRequired = dto.UserId == currentUserId && !isAdmin;
            if (passwordRequired && string.IsNullOrEmpty(dto.Password))
                return BadRequest(new { message = "Jelszó szükséges" });

            var success = await authService.DisableEmail2FAAsync(dto.UserId, dto.Password);

            return success
                ? Ok(new { success = true, message = "Kétlépcsős azonosítás letiltva" })
                : BadRequest(new { success = false, message = "Nem sikerült letiltani a 2FA-t" });
        }
        private async Task RefreshToken()
        {
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    return;
                }
                HttpContext.Request.Cookies.TryGetValue("refreshToken", out var refreshToken);
                await authService.RefreshTokenAsync(refreshToken, HttpContext);
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
        [Authorize(Roles ="Admin")]
        [HttpGet("get")]
        public async Task<ActionResult<List<GetUserResponseObject>>> Get()
        {
            return await authService.get();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("queryUsers")]
        public async Task<ActionResult<List<GetUserResponseObject?>>> QueryUsers(GetUserQueryFilter request)
        {
            List<User> users = await authService.GetQueryUsersAsync(request);
            var userResponses = new List<GetUserResponseObject>();
            foreach(User user in users)
            {
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
        public async Task<ActionResult<Models.ErrorModel>> EditUser(EditUserDto request, [FromQuery] string? frontendHost)
        {
            int? id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (id == null)
            {
                return BadRequest(new Models.ErrorModel("Hiba történt"));
            }
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var isSuccessful = await authService.EditUserAsync(request, (int)id, frontendHost);
            return isSuccessful == true
                ? Ok(new Models.ErrorModel("Sikeres frissítés. Kérjük erősítse meg az új email címét."))
                : BadRequest(new Models.ErrorModel("Az email cím nem megfelelő vagy a jelszó hibás, nem történt változás"));
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
            await RefreshToken();
            if (User.Identity.IsAuthenticated)
            {
                var user = await authService.GetUserAsync(int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)));
                var resp = await authService.checkIfStatusChanged(User, HttpContext);
                if (resp)
                {
                    await authService.logout(HttpContext);
                    return Ok(new LoginState(false, user));
                }
                return Ok(new LoginState(true, user));
            }
            return Ok(new LoginState(false, null));
        }


        [AllowAnonymous]
        [HttpDelete("logout")]
        public async Task<ActionResult> Logout()
        {
            await authService.logout(HttpContext);
            return Ok();
        }


        [AllowAnonymous]
        [HttpPost("checkIfAdmin")]
        public async Task<ActionResult<LoginState>> CheckIfAdmin()
        {
            var huh = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int id);
            if (huh||id==null)
            {
                return Ok(new LoginState(false, null));
            }
            var user = await authService.GetUserAsync(id);
            if (User.Identity.IsAuthenticated && User.FindFirstValue(ClaimTypes.Role)=="Admin")
            {
                return Ok(new LoginState(true, user));
            }
            return Ok(new LoginState(false, user));
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
        [Authorize]
        [HttpPatch("change-password")]
        public async Task<ActionResult<Models.ErrorModel?>> ChangePassword([FromBody] EditPasswordDto request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var isSuccessful = await authService.EditPasswordAsync(request, userId);
            return isSuccessful == true
                ? Ok(new Models.ErrorModel("Sikeres frissítés. Megerősítő emailt küldtünk."))
                : BadRequest(new Models.ErrorModel("A megadott jelszó nem megfelelő"));
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("force-password-change/{id}")]
        public async Task<ActionResult<Models.ErrorModel?>> ForcePasswordChange(int id, [FromBody] string newPassword)
        {
            if (User.FindFirstValue(ClaimTypes.Role) == "Admin" &&
                authService.GetUserAsync(id)?.Result.role == "Admin")
            {
                return StatusCode(403, new ErrorModel("Admin jelszavát nem lehet így módosítani"));
            }

            var isSuccessful = await authService.ForcePasswordChangeAsync(id, newPassword);
            return isSuccessful == true
                ? Ok(new Models.ErrorModel("Jelszó sikeresen megváltoztatva"))
                : BadRequest(new Models.ErrorModel("Érvénytelen jelszó"));
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("change-status/{id}")]
        public async Task<ActionResult<Models.ErrorModel?>> ChangeUserStatus(int id, [FromBody] int newStatus)
        {
            if (authService.GetUserAsync(id)?.Result.role == "Admin")
            {
                return StatusCode(403, new ErrorModel("Admin státusza nem módosítható"));
            }

            var result = await authService.ChangeUserStatusAsync(id, newStatus);
            return result == true
                ? Ok(new Models.ErrorModel("Státusz sikeresen módosítva"))
                : BadRequest(new Models.ErrorModel("Érvénytelen státusz"));
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("request-password-reset/{userId}")]
        public async Task<ActionResult> RequestPasswordReset(int userId, [FromQuery] string? frontendHost)
        {
            var targetUser = await authService.GetUserAsync(userId);
            if (targetUser == null) return BadRequest(new ErrorModel("Felhasználó nem található"));
            if (targetUser.role == "Admin") return StatusCode(403, new ErrorModel("Admin jelszavát nem lehet így visszaállítani"));

            var token = await authService.GeneratePasswordResetTokenAsync(userId);
            if (token == null) return BadRequest(new ErrorModel("Hiba történt a token generálása közben"));

            var resetLink = $"{Request.Scheme}://${frontendHost}/reset-password?userId={userId}&token={WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token))}";

            await emailService.SendEmailAsync(
                targetUser.email,
                "Jelszó visszaállítási kérés",
                $"<h3>Jelszó visszaállítást kértek a fiókjához</h3>" +
                $"<p>Kattintson <a href='{resetLink}'>ide</a> az új jelszó beállításához.</p>" +
                $"<p>A link 24 órán belül lejár.</p>" +
                $"<p>Ha Ön nem kezdeményezte ezt a kérést, kérjük, hagyja figyelmen kívül ezt az üzenetet.</p>");

            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("verify-password-reset")]
        public async Task<ActionResult> VerifyPasswordResetToken([FromQuery] int userId, [FromQuery] string token)
        {
            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
            var isValid = await authService.VerifyPasswordResetTokenAsync(userId, decodedToken);
            return isValid
                ? Ok(new { valid = true })
                : BadRequest(new ErrorModel("Érvénytelen vagy lejárt token"));
        }

        [AllowAnonymous]
        [HttpPost("complete-password-reset")]
        public async Task<ActionResult> CompletePasswordReset([FromBody] CompletePasswordResetDto request)
        {
            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Token));
            var isValid = await authService.VerifyPasswordResetTokenAsync(request.UserId, decodedToken);

            if (!isValid) return BadRequest(new ErrorModel("Érvénytelen vagy lejárt token"));

            var success = await authService.CompletePasswordResetAsync(request.UserId, request.NewPassword);

            return success
                ? Ok(new { success = true })
                : BadRequest(new ErrorModel("Érvénytelen jelszó"));
        }
    }
}
