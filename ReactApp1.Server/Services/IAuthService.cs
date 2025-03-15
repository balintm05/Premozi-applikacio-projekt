﻿using Microsoft.AspNetCore.Identity;
using ReactApp1.Server.Entities;
using ReactApp1.Server.Models.JWT;
using ReactApp1.Server.Models.User;
using ReactApp1.Server.Models.User.EditUser;
using ReactApp1.Server.Models.User.Response;

namespace ReactApp1.Server.Services
{
    public interface IAuthService
    {       
        Task<TokenResponseDto?> LoginAsync(AuthUserDto request);
        Task<TokenResponseDto?> RegisterAsync(AuthUserDto request);   
        Task<User?> GetUserAsync(int pid);
        Task<List<User>?> GetAllUsersAsync();
        Task<List<User>?> GetQueryUsersAsync(GetUserQueryFilter request);
        Task<bool?> EditUserAsync(EditUserDto request, int pid);
        Task<bool?> EditUserAdminAsync(EditUserAdminDto request);
        Task<bool?> EditPasswordAsync(EditPasswordDto request, int pid);
        Task<TokenResponseDto?> RefreshTokenAsync(string refToken);
        void SetTokensInsideCookie(TokenResponseDto token, HttpContext context);
        //just no
        //Task<HttpResponseMessage?> OkResponseSetTokenCookie(TokenResponseDto request);
    }
}
