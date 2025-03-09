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

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<ActionResult<TokenResponseDto>> Login(AuthUserDto request)
        {
            var token = await authService.LoginAsync(request);
            if (token == null) 
            {
                return BadRequest("A megadott Email cím-jelszó kombinációval rendelkező felhasználó nem található");
            }
            return Ok(token);
        }
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(AuthUserDto request)
        {
            var user = await authService.RegisterAsync(request);
            if (user == null) 
            {
                return BadRequest("Az Email címnek egyedinek és validnak, a jelszónak pedig 6 és 30 karakter között kell lennie");
            }        
            return Ok(user);
        }
        [HttpPost("refresh-token")]
        public async Task<ActionResult<TokenResponseDto>> RefreshToken(RefreshTokenRequestDto request)
        {
            var result = await authService.RefreshTokenAsync(request);
            return result==null||result.AccessToken==null||result.RefreshToken==null ? Unauthorized("Invalid refresh token") : Ok(result);
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
