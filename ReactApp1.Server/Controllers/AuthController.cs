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
using ReactApp1.Server.Services;
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

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<Models.ErrorModel?>> Login(AuthUserDto request)
        {
            if (User.Identity.IsAuthenticated)
            {
                return BadRequest(new Models.ErrorModel("Már be vagy jelentkezve") );
            }
            var token = await authService.LoginAsync(request);
            if (token.Error != null) 
            {
                return BadRequest(token.Error);
            }
            authService.SetTokensInsideCookie(token,HttpContext);
            return Ok();
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<Models.ErrorModel?>> Register(AuthUserDto request)
        {
            if (User.Identity.IsAuthenticated)
            {
                return BadRequest(new Models.ErrorModel("Már be vagy jelentkezve") );
            }
            var token = await authService.RegisterAsync(request);
            if (token.Error != null) 
            {
                return BadRequest(token.Error);
            }
            authService.SetTokensInsideCookie(token, HttpContext);
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
        [HttpPost("queryUsers")]
        public async Task<ActionResult<List<GetUserResponseObject?>>> QueryUsers(GetUserQueryFilter request)
        {
            List<User> users = await authService.GetQueryUsersAsync(request);
            var userResponses = new List<GetUserResponseObject>();
            foreach(User user in users)
            {
                userResponses.Add(new GetUserResponseObject(user));
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
                return BadRequest("Hiba történt");
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
        public ActionResult<LoginState> CheckIfLoggedIn()
        {
            if (User.Identity.IsAuthenticated)
            {
                return Ok(new LoginState(true));
            }
            return Ok(new LoginState(false));
        }
        [Authorize]
        [HttpDelete("logout")]
        public ActionResult Logout()
        {
            HttpContext.Response.Cookies.Delete("refreshToken", new CookieOptions { Path = "/", Domain = "localhost"});
            HttpContext.Response.Cookies.Delete("accessToken", new CookieOptions { Path = "/", Domain = "localhost" });
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
    }
}
