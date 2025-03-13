using Microsoft.AspNetCore.Identity;
using ReactApp1.Server.Entities;
using ReactApp1.Server.Models.JWT;
using ReactApp1.Server.Models.User;
using ReactApp1.Server.Models.User.EditUser;

namespace ReactApp1.Server.Services
{
    public interface IAuthService
    {       
        Task<TokenResponseDto?> LoginAsync(AuthUserDto request);
        Task<TokenResponseDto?> RegisterAsync(AuthUserDto request);       
        Task<List<User>?> GetAllUsersAsync();       
        Task<User?> EditUserAsync(EditUserDto request, int pid);
        Task<User?> EditUserAdminAsync(EditUserAdminDto request, int pid);
        Task<User?> EditPasswordAsync(EditPasswordDto request, int pid);
        Task<TokenResponseDto?> RefreshTokenAsync(string refToken);
        void SetTokensInsideCookie(TokenResponseDto token, HttpContext context);
        //just no
        //Task<HttpResponseMessage?> OkResponseSetTokenCookie(TokenResponseDto request);
    }
}
