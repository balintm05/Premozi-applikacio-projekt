using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Entities;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models.JWT;
using ReactApp1.Server.Models.User;
using ReactApp1.Server.Models.User.EditUser;
using ReactApp1.Server.Models.User.Response;
using System.Security.Claims;

namespace ReactApp1.Server.Services.Auth
{
    public interface IAuthService
    {       
        Task<TokenResponseDto?> LoginAsync(AuthUserDto request);
        Task<TokenResponseDto?> RegisterAsync(AuthUserDto request);   
        Task<User?> GetUserAsync(int pid);
        Task<List<User>?> GetQueryUsersAsync(GetUserQueryFilter request);
        Task<bool?> EditUserAsync(EditUserDto request, int pid);
        Task<bool?> EditUserAdminAsync(EditUserAdminDto request);
        Task<bool?> EditPasswordAsync(EditPasswordDto request, int pid);
        Task<TokenResponseDto?> RefreshTokenAsync(string refToken);
        void SetTokensInsideCookie(TokenResponseDto token, HttpContext httpcontext);
        Task<bool> checkIfStatusChanged(ClaimsPrincipal User);
        Task<ErrorModel?> deleteUser(int id);
        Task logout(HttpContext httpcontext);
        Task<TokenResponseDto> CreateTokenResponse(User? user);
        Task<string> GenerateEmailConfirmationTokenAsync(User user);
        Task<bool> ConfirmEmailAsync(int userId, string token);
        Task<string> Generate2FATokenAsync(User user);
        Task<bool> Verify2FATokenAsync(User user, string token);
        Task<List<string>> Generate2FARecoveryCodesAsync(User user);
        Task<User?> GetUserByEmailAsync(string email);
        //just no
        //Task<HttpResponseMessage?> OkResponseSetTokenCookie(TokenResponseDto request);
    }
}
