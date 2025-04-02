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
        Task<bool?> EditUserAsync(EditUserDto request, int pid, string baseUrl);
        Task<bool?> EditUserAdminAsync(EditUserAdminDto request);
        Task<bool?> EditPasswordAsync(EditPasswordDto request, int pid);
        Task<TokenResponseDto?> RefreshTokenAsync(string refToken);
        void SetTokensInsideCookie(TokenResponseDto token, HttpContext httpcontext);
        Task<bool> checkIfStatusChanged(ClaimsPrincipal User, HttpContext httpContext);
        Task<ErrorModel?> deleteUser(int id);
        Task logout(HttpContext httpcontext);
        Task<TokenResponseDto> CreateTokenResponse(User? user);
        Task<string> GenerateEmailConfirmationTokenAsync(User user);
        Task<bool> ConfirmEmailAsync(int userId, string token);
        Task<User?> GetUserByEmailAsync(string email);
        Task StoreEmail2FACodeAsync(int userId, string code, int expiryMinutes);
        Task<bool> VerifyEmail2FACodeAsync(int userId, string code);
        Task<bool> EnableEmail2FAAsync(int userId);
        Task<bool> DisableEmail2FAAsync(int userId, string? password = null);
        Task<bool> StartEmail2FAFlowAsync(int userId);
        Task<List<GetUserResponseObject>> get();
        Task<bool> ForcePasswordChangeAsync(int userId, string newPassword);
        Task<bool> ChangeUserStatusAsync(int userId, int newStatus);
        Task<string> GeneratePasswordResetTokenAsync(int userId);
        Task<bool> VerifyPasswordResetTokenAsync(int userId, string token);
        Task<bool> CompletePasswordResetAsync(int userId, string newPassword);

            //just no
            //Task<HttpResponseMessage?> OkResponseSetTokenCookie(TokenResponseDto request);
        }
}
