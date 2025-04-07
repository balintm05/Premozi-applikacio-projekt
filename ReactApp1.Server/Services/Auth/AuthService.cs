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
using Org.BouncyCastle.Crypto.Generators;
using ReactApp1.Server.Services.Email;
using Microsoft.AspNetCore.WebUtilities;
using NuGet.Protocol;
//using System.Data.Entity;

//https://www.youtube.com/watch?v=6EEltKS8AwA

namespace ReactApp1.Server.Services.Auth
{
    public class AuthService(DataBaseContext context, IConfiguration configuration, IEmailService emailService):IAuthService
    {
        public async Task<TokenResponseDto?> LoginAsync(AuthUserDto request)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.email == request.email);
            if (user == null || new PasswordHasher<User>().VerifyHashedPassword(user, user.passwordHash, request.password) == PasswordVerificationResult.Failed)
            {
                return new TokenResponseDto { Error = new ErrorModel("A megadott Email cím-jelszó kombinációval rendelkező felhasználó nem található") };
            };

            if (user.PasswordResetRequired)
            {
                return new TokenResponseDto { Error = new ErrorModel("Jelszó visszaállítás szükséges") };
            }

            if (user.accountStatus == 2)
            {
                return new TokenResponseDto { Error = new ErrorModel("A fiók fel van függesztve") };
            }
            user.refreshTokenExpiry = DateTime.UtcNow.AddDays(3);
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
        public async Task<List<GetUserResponseObject>> get()
        {
            var users = await context.Users.ToListAsync();
            var list = new List<GetUserResponseObject>();   
            foreach(var user in users)
            {
                list.Add(new GetUserResponseObject(user));   
            }
            return list;
        }

        public async Task<bool?> EditUserAsync(EditUserDto request, int pid, string baseUrl)
        {
            var user = await context.Users.FindAsync(pid);
            if (user == null) return false;

            var passwordVerification = new PasswordHasher<User>().VerifyHashedPassword(
                user, user.passwordHash, request.currentPassword);
            if (passwordVerification != PasswordVerificationResult.Success)
                return false;

            if (!new EmailAddressAttribute().IsValid(request.email))
                return false;

            var confirmationToken = await GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(confirmationToken));

            if (user.email != request.email)
            {
                user.email = request.email;
                user.EmailConfirmed = false;
                await emailService.SendEmailAsync(
                    request.email,
                    "Erősítse meg új email címét",
                    $"<h1>Email cím változás</h1>" +
                    $"<p>Kattintson <a href='{baseUrl}/auth/confirm-email?userId={user.userID}&token={encodedToken}'>ide</a> az új email cím megerősítéséhez.</p>");
            }           
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ChangeUserStatusAsync(int userId, int newStatus)
        {
            if (newStatus < 1 || newStatus > 2) return false;

            var user = await context.Users.FindAsync(userId);
            if (user == null) return false;

            user.accountStatus = newStatus;
            await context.SaveChangesAsync();

            var statusMessage = newStatus == 1 ? "aktiválva" : "felfüggesztve";
            await emailService.SendEmailAsync(
                user.email,
                "Fiók állapot változás",
                $"<h3>Fiókjának állapota megváltozott</h3>" +
                $"<p>Az Ön fiókja {statusMessage} lett.</p>");

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
            if (user == null) return false;

            if (!request.forceChange)
            {
                var passwordVerification = new PasswordHasher<User>().VerifyHashedPassword(
                    user, user.passwordHash, request.currentPassword);

                if (passwordVerification != PasswordVerificationResult.Success)
                    return false;
            }

            if (request.newPassword.Length < 6 || request.newPassword.Length > 30)
                return false;

            var hashedPw = new PasswordHasher<User>().HashPassword(user, request.newPassword);
            user.passwordHash = hashedPw;
            await context.SaveChangesAsync();
            await emailService.SendEmailAsync(
                user.email,
                "Jelszó megváltoztatva",
                $"<h3>Az Ön jelszava megváltozott</h3>" +
                $"<p>Ez egy megerősítés, hogy az Ön fiókjának jelszava megváltozott {DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm")} időpontban.</p>" +
                $"<p>Ha Ön nem kezdeményezte ezt a változtatást, kérjük azonnal lépjen kapcsolatba az ügyfélszolgálattal.</p>");

            return true;
        }
        public async Task<string> GeneratePasswordResetTokenAsync(int userId)
        {
            var user = await context.Users.FindAsync(userId);
            if (user == null) return null;

            var token = Guid.NewGuid().ToString() + DateTime.UtcNow.Ticks.ToString();
            user.PasswordResetToken = BCrypt.Net.BCrypt.HashPassword(token);
            user.PasswordResetTokenExpiry = DateTime.UtcNow.AddDays(1);
            user.PasswordResetRequired = true;
            await context.SaveChangesAsync();

            return token;
        }

        public async Task<bool> VerifyPasswordResetTokenAsync(int userId, string token)
        {
            var user = await context.Users.FindAsync(userId);
            if (user == null || user.PasswordResetTokenExpiry < DateTime.UtcNow)
                return false;

            return BCrypt.Net.BCrypt.Verify(token, user.PasswordResetToken);
        }

        public async Task<bool> CompletePasswordResetAsync(int userId, string newPassword)
        {
            var user = await context.Users.FindAsync(userId);
            if (user == null || !user.PasswordResetRequired)
                return false;
            if (newPassword.Length < 6 || newPassword.Length > 30)
                return false;
            var hashedPw = new PasswordHasher<User>().HashPassword(user, newPassword);
            user.passwordHash = hashedPw;
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpiry = null;
            user.PasswordResetRequired = false;
            await context.SaveChangesAsync();
            await emailService.SendEmailAsync(
                user.email,
                "Jelszó visszaállítva",
                $"<h3>Az Ön jelszava sikeresen visszaállítottuk</h3>" +
                $"<p>A jelszó visszaállítása megtörtént: {DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm")}</p>" +
                $"<p>Ha Ön nem kezdeményezte ezt a változtatást, azonnal lépjen kapcsolatba az ügyfélszolgálattal.</p>");

            return true;
        }
        public async Task<bool> ForcePasswordChangeAsync(int userId, string newPassword)
        {
            var user = await context.Users.FindAsync(userId);
            if (user == null) return false;

            if (newPassword.Length < 6 || newPassword.Length > 30)
                return false;

            var hashedPw = new PasswordHasher<User>().HashPassword(user, newPassword);
            user.passwordHash = hashedPw;
            await context.SaveChangesAsync();

            await emailService.SendEmailAsync(
                user.email,
                "Jelszó megváltoztatva (adminisztrátori művelet)",
                $"<h3>Az Ön jelszava adminisztrátori beavatkozással megváltozott</h3>" +
                $"<p>Az új jelszó beállítása történt: {DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm")}</p>" +
                $"<p>Kérjük, jelentkezzen be az új jelszavával.</p>" +
                $"<p>Ha Ön nem kért jelszóváltoztatást, azonnal lépjen kapcsolatba az ügyfélszolgálattal.</p>");

            return true;
        }


        public async Task<ErrorModel?> deleteUser(int id)
        {
            try
            {
                var user = await context.Users.FindAsync(id);
                if (user == null)
                {
                    return new ErrorModel("Nincs ilyen id-jű felhasználó");
                }

                context.Users.Remove(user);
                await context.SaveChangesAsync();
                await emailService.SendEmailAsync(
                    user.email,
                    "Fiók törölve",
                    $"<h3>Az Ön fiókja törölve lett</h3>" +
                    $"<p>A fiók törlése megtörtént: {DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm")}</p>" +
                    $"<p>Ha Ön nem kezdeményezte a fiók törlését, azonnal lépjen kapcsolatba az ügyfélszolgálattal.</p>");

                return new ErrorModel("Sikeres törlés");
            }
            catch (Exception ex)
            {
                return new ErrorModel(ex.Message);
            }
        }
        public async Task logout(HttpContext httpContext)
        {
            httpContext.Response.Cookies.Delete("refreshToken", new CookieOptions { Path = "/" });
            httpContext.Response.Cookies.Delete("accessToken", new CookieOptions { Path = "/"});
        }







        public async Task RefreshTokenAsync(string refToken, HttpContext httpContext)
        {
            var user = await ValidateRefreshTokenAsync(refToken);
            if (user == null)
            {
                if (string.IsNullOrEmpty(refToken))
                {
                    user = await context.Users.FirstAsync(u => u.refreshToken == refToken);
                    user.refreshTokenExpiry = null;
                    user.refreshToken = null;
                    context.Users.Update(user);
                    await context.SaveChangesAsync();
                }
                user = await context.Users.FirstAsync(u => u.refreshToken == refToken);
                user.refreshTokenExpiry = null;
                user.refreshToken = null;
                context.Users.Update(user);
                await context.SaveChangesAsync();
                await logout(httpContext);
                return;
            }
            var resp = await CreateTokenResponse(user);
            await SetTokensInsideCookie(resp, httpContext);
        }


        private async Task<User?> ValidateRefreshTokenAsync(string refToken)
        {
            var user = await context.Users.FirstAsync(u => u.refreshToken == refToken && u.refreshTokenExpiry > DateTime.UtcNow);
            return user;
        }


        public async Task<TokenResponseDto> CreateTokenResponse(User? user)
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


        private async Task<string?> GenerateAndSaveRefreshTokenAsync(User user)
        {
            if (user.refreshTokenExpiry == null)
            {
                user.refreshTokenExpiry = DateTime.UtcNow.AddDays(3);
            }
            var rToken = GenerateRefreshToken();
            user.refreshToken = rToken;
            await context.SaveChangesAsync();
            return rToken;
        }


        private string CreateToken(User user)
        {
            var Claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.userID.ToString()),
                new Claim(ClaimTypes.Email, user.email),
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


        public Task SetTokensInsideCookie(TokenResponseDto token, HttpContext httpcontext)
        {
            httpcontext.Response.Cookies.Append("accessToken", token.AccessToken, new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddMinutes(30),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            });
            httpcontext.Response.Cookies.Append("refreshToken", token.RefreshToken, new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(3),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            });
            return Task.CompletedTask;
        }

        
        public async Task<bool> checkIfStatusChanged(ClaimsPrincipal User, HttpContext httpContext)
        {
            var user = await context.Users.FindAsync(int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)));
            if(user == null || user.accountStatus == 2)
            {
                return true;
            }
            if (user.email!=User.FindFirstValue(ClaimTypes.Email))
            {            
                return true;
            }
            if(user.role != User.FindFirstValue(ClaimTypes.Role))
            {
                await SetTokensInsideCookie(await CreateTokenResponse(user), httpContext);             
            }
            return false;
        }
        public async Task<string> GenerateEmailConfirmationTokenAsync(User user)
        {
            var token = Guid.NewGuid().ToString() + DateTime.UtcNow.Ticks.ToString();
            user.EmailConfirmationToken = BCrypt.Net.BCrypt.HashPassword(token);
            user.EmailConfirmationTokenExpiry = DateTime.UtcNow.AddDays(1);
            await context.SaveChangesAsync();
            return token;
        }

        public async Task<bool> ConfirmEmailAsync(int userId, string token)
        {
            var user = await context.Users.FindAsync(userId);
            if (user == null || user.EmailConfirmationTokenExpiry < DateTime.UtcNow)
                return false;

            if (BCrypt.Net.BCrypt.Verify(token, user.EmailConfirmationToken))
            {
                user.EmailConfirmed = true;
                user.EmailConfirmationToken = null;
                user.EmailConfirmationTokenExpiry = null;
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await context.Users.FirstOrDefaultAsync(u => u.email == email);
        }
        public async Task StoreEmail2FACodeAsync(int userId, string code, int expiryMinutes)
        {
            await context.Email2FACodes.AddAsync(new Email2FACodes
            {
                UserID = userId,
                Code = code,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes)
            });
            await context.SaveChangesAsync();
        }

        public async Task<bool> VerifyEmail2FACodeAsync(int userId, string code)
        {
            var storedCode = await context.Email2FACodes
                .FirstOrDefaultAsync(x =>
                    x.UserID == userId &&
                    x.Code == code &&
                    x.ExpiresAt > DateTime.UtcNow);
            if (storedCode == null)
            {
                return false;
            }
            context.Email2FACodes.Remove(storedCode);
            await context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> EnableEmail2FAAsync(int userId)
        {
            var user = await context.Users.FindAsync(userId);
            if (user == null||user.TwoFactorEnabled==true) return false;

            user.TwoFactorEnabled = true;
            await context.SaveChangesAsync();

            await emailService.SendEmailAsync(
                user.email,
                "Kétlépcsős azonosítás engedélyezve",
                $"<h3>Kétlépcsős azonosítás engedélyezve</h3>" +
                $"<p>Az Ön fiókjában mostantól kétlépcsős azonosítás van érvényben.</p>");

            return true;
        }
        public async Task<bool> DisableEmail2FAAsync(int userId, string? password = null)
        {
            var user = await context.Users.FindAsync(userId);
            if (user == null||user.TwoFactorEnabled==false) return false;
            if (password != null)
            {
                var result = new PasswordHasher<User>().VerifyHashedPassword(user, user.passwordHash, password);
                if (result != PasswordVerificationResult.Success)
                    return false;
            }

            user.TwoFactorEnabled = false;
            await context.SaveChangesAsync();

            await emailService.SendEmailAsync(
                user.email,
                "Kétlépcsős azonosítás letiltva",
                "<h3>Kétlépcsős azonosítás letiltva</h3>" +
                "<p>Az Ön fiókjában a kétlépcsős azonosítás mostantól ki van kapcsolva.</p>");

            return true;
        }
        public async Task<bool> StartEmail2FAFlowAsync(int userId)
        {
            var user = await context.Users.FindAsync(userId);
            if (user == null) return false;

            var code = new Random().Next(100000, 999999).ToString();
            await StoreEmail2FACodeAsync(userId, code, 5);
            await emailService.SendEmailAsync(
                user.email,
                "Kétfaktoros azonosító kód",
                $"<h3>Az Ön kétfaktoros azonosító kódja: <strong>{code}</strong></h3><p>Ez a kód 5 percig érvényes.</p>");

            return true;
        }

    }
}
