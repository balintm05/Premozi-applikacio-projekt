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

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<ActionResult<HttpResponseMessage>> Login(AuthUserDto request)
        {
            var token = await authService.LoginAsync(request);
            if (token == null) 
            {               
                
                return BadRequest(new { message = "A megadott Email cím-jelszó kombinációval rendelkező felhasználó nem található" });
            }
            Response.Cookies.Append("JWTToken",token.AccessToken, new CookieOptions { /*HttpOnly = true,*/ Expires = DateTimeOffset.UtcNow.AddDays(7)});
            Response.Cookies.Append("refreshToken", token.RefreshToken, new CookieOptions { /*HttpOnly = true,*/ Expires = DateTimeOffset.UtcNow.AddDays(7), Path = "/refresh" });
            return Ok();
        }
        [HttpPost("register")]
        public async Task<ActionResult<HttpResponseMessage>> Register(AuthUserDto request)
        {
            var token = await authService.RegisterAsync(request);
            if (token == null) 
            {
                return BadRequest("Az Email címnek egyedinek és validnak, a jelszónak pedig 6 és 30 karakter között kell lennie");
            }
            Response.Cookies.Append("JWTToken", token.AccessToken, new CookieOptions { /*HttpOnly = true,*/ Expires = DateTimeOffset.UtcNow.AddDays(7) });
            Response.Cookies.Append("refreshToken", token.RefreshToken, new CookieOptions { /*HttpOnly = true,*/ Expires = DateTimeOffset.UtcNow.AddDays(7), Path = "/refresh" });
            return Ok();
        }
        [HttpPost("refresh-token")]
        public async Task<ActionResult<HttpResponseMessage>> RefreshToken(RefreshTokenRequestDto request)
        {
            var token = await authService.RefreshTokenAsync(request);
            if (token == null || token.AccessToken == null || token.RefreshToken == null)
            {
                return Unauthorized("Invalid JWT or refresh token");
            }
            Response.Cookies.Append("JWTToken", token.AccessToken, new CookieOptions { /*HttpOnly = true,*/ Expires = DateTimeOffset.UtcNow.AddDays(7) });
            Response.Cookies.Append("refreshToken", token.RefreshToken, new CookieOptions { /*HttpOnly = true,*/ Expires = DateTimeOffset.UtcNow.AddDays(7), Path = "/refresh" });
            return Ok();
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
    }
}
