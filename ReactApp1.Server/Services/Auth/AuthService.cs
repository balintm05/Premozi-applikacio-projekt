using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using ReactApp1.Server.Data;
using ReactApp1.Server.Entities;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.SignalR;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Models.JWT;
using ReactApp1.Server.Models.User;
using ReactApp1.Server.Models.User.EditUser;
using NuGet.Common;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using ReactApp1.Server.Models.User.Response;
using ReactApp1.Server.Models;

//https://www.youtube.com/watch?v=6EEltKS8AwA

namespace ReactApp1.Server.Services.Auth
{
    public class AuthService(DataBaseContext context, IConfiguration configuration):IAuthService
    {
        public async Task<TokenResponseDto?> LoginAsync(AuthUserDto request)
        {            
            var user = await context.Users.FirstOrDefaultAsync(x => x.email == request.email);
            if (user == null || new PasswordHasher<User>().VerifyHashedPassword(user, user.passwordHash, request.password) == PasswordVerificationResult.Failed)
            {
                return new TokenResponseDto { Error = new ErrorModel("A megadott Email cím-jelszó kombinációval rendelkező felhasználó nem található") };
            };
            if(user.accountStatus == 2)
            {
                return new TokenResponseDto { Error = new ErrorModel("A fiók fel van függesztve") };
            }
            return await CreateTokenResponse(user);

        }       


        public async Task<TokenResponseDto?> RegisterAsync(AuthUserDto request)
        {            
            if (await context.Users.AnyAsync(u => u.email == request.email))
            {
                return new TokenResponseDto { Error = new ErrorModel("Az Email címnek egyedinek kell lennie") };
            }
            if (!new EmailAddressAttribute().IsValid(request.email))
            {
                return new TokenResponseDto { Error = new ErrorModel("Az Email címnek validnak kell lennie") };
            }
            if (!(request.password.Length >= 6 && request.password.Length <= 30))
            {
                return new TokenResponseDto { Error = new ErrorModel("A jelszónak 6 és 30 karakter között kell lennie") };
            }
            if (!new Regex("^[a-zA-Z0-9_.-]*$").IsMatch(request.password))
            {
                return new TokenResponseDto { Error = new ErrorModel("A jelszó csak alfanumerikus karakterekből állhat") };
            }            
            var user = new User();
            var hashedPw = new PasswordHasher<User>().HashPassword(user, request.password);
            user.passwordHash = hashedPw;
            user.email = request.email;
            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
            return await CreateTokenResponse(user);
        }        


        public async Task<User?> GetUserAsync(int pid)
        {
            return await context.Users.FindAsync(pid);
        }


        public async Task<List<User>?> GetQueryUsersAsync(GetUserQueryFilter request)
        {
            request.role = request.role == "none" ? "" : request.role;
            request.accountStatus = request.accountStatus == "none" ? "" : request.accountStatus;
            var users = await context.Users.ToListAsync();
            if (!string.IsNullOrEmpty(request.userID)&&int.TryParse(request.userID, out int r))
            {
                users=await users.ToAsyncEnumerable().WhereAwait(async user => user.userID.ToString().ToLower().Equals(request.userID.ToLower())).ToListAsync();
            }
            if (!string.IsNullOrEmpty(request.email))
            {
                users = await users.ToAsyncEnumerable().WhereAwait(async user => user.email.ToLower().StartsWith(request.email.ToLower())).ToListAsync();
            }
            if (!string.IsNullOrEmpty(request.accountStatus) && int.TryParse(request.accountStatus, out int s))
            {
                users = await users.ToAsyncEnumerable().WhereAwait(async user => user.accountStatus.ToString().ToLower().Equals(request.accountStatus.ToLower())).ToListAsync();
            }
            if (!string.IsNullOrEmpty(request.role))
            {
                users = await users.ToAsyncEnumerable().WhereAwait(async user => user.role.ToLower().Equals(request.role.ToLower())).ToListAsync();
            }
            if (!string.IsNullOrEmpty(request.Megjegyzes))
            {
                users = await users.ToAsyncEnumerable().WhereAwait(async user => user.Megjegyzes.ToLower().Contains(request.Megjegyzes.ToLower())).ToListAsync();
            }
            return users;
        }


        public async Task<bool?> EditUserAsync(EditUserDto request, int pid)
        {
            if(!new EmailAddressAttribute().IsValid(request.email))
            {
                return false;
            }
            var user = await context.Users.FindAsync(pid);
            var patchDoc = new JsonPatchDocument<User>{ };
            patchDoc.Replace(user => user.email, request.email);
            patchDoc.ApplyTo(user);
            await context.SaveChangesAsync();
            return true;
        }


        public async Task<bool?> EditUserAdminAsync(EditUserAdminDto request)
        {
            try
            {
                var user = await context.Users.FindAsync(request.id);
                if (user == null || !new EmailAddressAttribute().IsValid(request.email) || !configuration["roles"].Split(',').ToList().Contains(request.role) || request.accountStatus.ToString().Length != 1)
                {
                    return false;
                }
                var patchDoc = new JsonPatchDocument<User> { };
                patchDoc.Replace(user => user.email, request.email);
                patchDoc.Replace(user => user.role, request.role);
                patchDoc.Replace(user => user.accountStatus, request.accountStatus);
                patchDoc.Replace(user => user.Megjegyzes, request.Megjegyzes);
                patchDoc.ApplyTo(user);
                await context.SaveChangesAsync();
                return true;
            }
            catch (NullReferenceException ex) 
            { 
                return false; 
            }
        }


        public async Task<bool?> EditPasswordAsync(EditPasswordDto request, int pid)
        {
            var user = await context.Users.FindAsync(pid);
            if(!(request.password.Length>=6 && request.password.Length <= 30))
            {
                return false;
            }
            var hashedPw = new PasswordHasher<User>().HashPassword(user, request.password);
            var patchDoc = new JsonPatchDocument<User> { };
            patchDoc.Replace(user => user.passwordHash, hashedPw);
            patchDoc.ApplyTo(user);
            await context.SaveChangesAsync();
            return true;

        }


        public async Task<ErrorModel?> deleteUser(int id)
        {
            try
            {
                context.Users.Remove(await context.Users.FindAsync(id));
                await context.SaveChangesAsync();              
                return new ErrorModel("Sikeres törlés");
            }
            catch (IndexOutOfRangeException ex)
            {
                return new ErrorModel("Nincs ilyen id-jű felhasználó");
            }
            catch (Exception ex)
            {
                return new ErrorModel(ex.Message);
            }
        }
        public async Task logout(HttpContext httpContext)
        {
            httpContext.Response.Cookies.Delete("refreshToken", new CookieOptions { Path = "/", Domain = "localhost" });
            httpContext.Response.Cookies.Delete("accessToken", new CookieOptions { Path = "/", Domain = "localhost" });
        }






        //token methods

        public async Task<TokenResponseDto?> RefreshTokenAsync(string refToken)
        {
            var user = await ValidateRefreshTokenAsync(refToken);          
            return user != null ? 
                new TokenResponseDto
                {
                    AccessToken = CreateToken(user)
                } : null;
        }


        private async Task<User?> ValidateRefreshTokenAsync(string refToken)
        {
            var user = context.Users.FirstAsync(u => u.refreshToken == refToken && u.refreshTokenExpiry > DateTime.UtcNow).Result;
            return user;
        }


        private async Task<TokenResponseDto> CreateTokenResponse(User? user)
        {
            return new TokenResponseDto
            {
                AccessToken = CreateToken(user),
                RefreshToken = await GenerateAndSaveRefreshTokenAsync(user)
            };
        }


        private string GenerateRefreshToken()
        {
            var ranNum = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(ranNum);
            return Convert.ToHexString(ranNum);
        }


        private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
        {
            var rToken = GenerateRefreshToken();
            user.refreshToken = rToken;
            user.refreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await context.SaveChangesAsync();
            return rToken;
        }


        private string CreateToken(User user)
        {
            var Claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.userID.ToString()),
                //new Claim(ClaimTypes.Email, user.email),
                new Claim(ClaimTypes.Role, user.role.ToString())
            };
            var Key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["AppSettings:Token"]));
            var credentials = new SigningCredentials(Key, SecurityAlgorithms.HmacSha512);
            var tokenDescriptor = new JwtSecurityToken(
                issuer: configuration["AppSettings:Issuer"],
                audience: configuration["AppSettings:Audience"],
                claims: Claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: credentials
                );
            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }


        public void SetTokensInsideCookie(TokenResponseDto token, HttpContext httpcontext)
        {
            httpcontext.Response.Cookies.Append("accessToken", token.AccessToken, new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddMinutes(5),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Domain = "localhost"
            });
            httpcontext.Response.Cookies.Append("refreshToken", token.RefreshToken, new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(1),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Domain = "localhost"
            });
        }

        
        public async Task<bool> checkIfStatusChanged(ClaimsPrincipal User)
        {
            var user = await context.Users.FindAsync(int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)));
            if(user == null || user.accountStatus == 2)
            {
                return true;
            }
            if (user.role != User.FindFirstValue(ClaimTypes.Role))
            {            
                return true;
            }
            return false;
        }
    }
}
