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
            if (!User.Identity.IsAuthenticated)
            {
                return;
            }
            HttpContext.Request.Cookies.TryGetValue("accessToken", out var accessToken);
            HttpContext.Request.Cookies.TryGetValue("refreshToken", out var refreshToken);
            var token = await authService.RefreshTokenAsync(refreshToken);
            authService.SetTokensInsideCookie(token, HttpContext);
            
        }
        [Authorize]
        [HttpGet("AuthenticatedOnlyEndpoint")]
        public IActionResult AuthenticatedOnlyEndpoint()
        {
            return Ok();
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("AdminOnlyEndpoint")]
        public IActionResult AdminOnlyEndpoint()
        {
            return Ok();
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("GetAllUsers")]
        public async Task<ActionResult<List<User>>> GetAllUsers()
        {
            return Ok(await authService.GetAllUsersAsync());
        }
        [Authorize(Roles = "Admin, User")]
        [HttpPatch("EditUser/{id}")]
        public async Task<ActionResult<User>> EditUser(int id, EditUserDto request)
        {
            var user = await authService.EditUserAsync(request, id);
            return user!=null ? Ok(user) : BadRequest("Az email cím nem megfelelő, nem történt változás");
        }
        [Authorize(Roles = "Admin")]
        [HttpPatch("EditUserAdmin/{id}")]
        public async Task<ActionResult<User>> EditUserAdmin(int id, EditUserAdminDto request)
        {
            var user = await authService.EditUserAdminAsync(request, id);
            return user != null ? Ok(user) : BadRequest("Nem megfelelő értékek lettek megadva, nem történt változás");
        }
        [Authorize(Roles = "Admin, User")]
        [HttpPatch("EditPassword/{id}")]
        public async Task<ActionResult<User>> EditPassword(int id, EditPasswordDto request)
        {          
            var user = await authService.EditPasswordAsync(request, id);
            return user!= null ? Ok(user) : BadRequest("A megadott jelszó nem megfelelő, nem történt változás");
        }
        [AllowAnonymous]
        [HttpPost("CheckIfLoggedIn")]
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

    }
}
