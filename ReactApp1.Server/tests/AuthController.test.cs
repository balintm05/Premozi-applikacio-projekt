using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Entities;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models.JWT;
using ReactApp1.Server.Models.User;
using ReactApp1.Server.Models.User.EditUser;
using ReactApp1.Server.Models.User.Response;
using ReactApp1.Server.Services.Auth;
using ReactApp1.Server.Services.Email;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.WebUtilities;

namespace ReactApp1.Server.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _mockAuthService;
        private readonly Mock<IEmailService> _mockEmailService;
        private readonly AuthController _controller;
        private readonly DefaultHttpContext _httpContext;

        public AuthControllerTests()
        {
            _mockAuthService = new Mock<IAuthService>();
            _mockEmailService = new Mock<IEmailService>();
            _controller = new AuthController(_mockAuthService.Object, _mockEmailService.Object);
            
            _httpContext = new DefaultHttpContext();
            _httpContext.Request.Scheme = "https";
            _httpContext.Request.Host = new HostString("localhost:7153");
            
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = _httpContext
            };
        }

        #region Login Tests

        [Fact]
        public async Task Login_WhenAlreadyAuthenticated_ReturnsBadRequest()
        {
            SetupAuthenticatedUser();
            var request = new AuthUserDto { email = "test@example.com", password = "Password123!" };

            var result = await _controller.Login(request);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("Már be vagy jelentkezve", errorModel.errorMessage);
        }

        [Fact]
        public async Task Login_WithInvalidCredentials_ReturnsBadRequest()
        {
            
            var request = new AuthUserDto { email = "test@example.com", password = "WrongPassword" };
            
            _mockAuthService.Setup(s => s.LoginAsync(request))
                .ReturnsAsync(new TokenResponse { Error = new ErrorModel("Hibás email cím vagy jelszó") });

            
            var result = await _controller.Login(request);

            
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("Hibás email cím vagy jelszó", errorModel.errorMessage);
        }

        [Fact]
        public async Task Login_WithUnconfirmedEmail_ReturnsBadRequest()
        {
            
            var request = new AuthUserDto { email = "unconfirmed@example.com", password = "Password123!" };
            var user = new User { userID = 1, email = "unconfirmed@example.com", EmailConfirmed = false };
            
            _mockAuthService.Setup(s => s.LoginAsync(request))
                .ReturnsAsync(new TokenResponse { AccessToken = "valid-token", RefreshToken = "valid-refresh-token" });
            
            _mockAuthService.Setup(s => s.GetUserByEmailAsync(request.email))
                .ReturnsAsync(user);

            
            var result = await _controller.Login(request);

            
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("Erősítse meg email címét", errorModel.errorMessage);
        }

        [Fact]
        public async Task Login_WithValidCredentials_And2FAEnabled_ReturnsRequires2FA()
        {
            
            var request = new AuthUserDto { email = "2fa@example.com", password = "Password123!" };
            var user = new User 
            { 
                userID = 1, 
                email = "2fa@example.com", 
                EmailConfirmed = true,
                TwoFactorEnabled = true 
            };
            
            _mockAuthService.Setup(s => s.LoginAsync(request))
                .ReturnsAsync(new TokenResponse { AccessToken = "valid-token", RefreshToken = "valid-refresh-token" });
            
            _mockAuthService.Setup(s => s.GetUserByEmailAsync(request.email))
                .ReturnsAsync(user);
                
            _mockAuthService.Setup(s => s.StartEmail2FAFlowAsync(user.userID))
                .ReturnsAsync(true);

            
            var result = await _controller.Login(request);

            
            var okResult = Assert.IsType<OkObjectResult>(result);
            dynamic response = okResult.Value;
            Assert.True((bool)response.success);
            Assert.True((bool)response.requires2FA);
            Assert.Equal(1, (int)response.userId);
        }

        [Fact]
        public async Task Login_WithValidCredentials_ReturnsOk()
        {
            
            var request = new AuthUserDto { email = "test@example.com", password = "Password123!" };
            var user = new User 
            { 
                userID = 1, 
                email = "test@example.com", 
                EmailConfirmed = true,
                TwoFactorEnabled = false 
            };
            var tokenResponse = new TokenResponse 
            { 
                AccessToken = "valid-token", 
                RefreshToken = "valid-refresh-token" 
            };
            
            _mockAuthService.Setup(s => s.LoginAsync(request))
                .ReturnsAsync(tokenResponse);
            
            _mockAuthService.Setup(s => s.GetUserByEmailAsync(request.email))
                .ReturnsAsync(user);
                
            _mockAuthService.Setup(s => s.SetTokensInsideCookie(tokenResponse, _httpContext))
                .Returns(Task.CompletedTask);

            
            var result = await _controller.Login(request);

            
            Assert.IsType<OkResult>(result);
            _mockAuthService.Verify(s => s.SetTokensInsideCookie(tokenResponse, _httpContext), Times.Once);
        }

        #endregion

        #region Register Tests

        [Fact]
        public async Task Register_WhenAlreadyAuthenticated_ReturnsBadRequest()
        {
            
            SetupAuthenticatedUser();
            var request = new AuthUserDto { email = "new@example.com", password = "Password123!" };

            
            var result = await _controller.Register(request, "https://localhost:3000");

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("Már be vagy jelentkezve", errorModel.errorMessage);
        }

        [Fact]
        public async Task Register_WithInvalidData_ReturnsBadRequest()
        {
            
            var request = new AuthUserDto { email = "invalid-email", password = "short" };
            
            _mockAuthService.Setup(s => s.RegisterAsync(request))
                .ReturnsAsync(new TokenResponse { Error = new ErrorModel("Érvénytelen email cím vagy jelszó") });

            
            var result = await _controller.Register(request, "https://localhost:3000");

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("Érvénytelen email cím vagy jelszó", errorModel.errorMessage);
        }

        [Fact]
        public async Task Register_WithValidData_SendsConfirmationEmail_ReturnsSuccess()
        {
            
            var request = new AuthUserDto { email = "new@example.com", password = "Password123!" };
            var user = new User { userID = 1, email = "new@example.com" };
            var frontendHost = "https://localhost:3000";
            
            _mockAuthService.Setup(s => s.RegisterAsync(request))
                .ReturnsAsync(new TokenResponse { AccessToken = "valid-token", RefreshToken = "valid-refresh-token" });
                
            _mockAuthService.Setup(s => s.GetUserByEmailAsync(request.email))
                .ReturnsAsync(user);
                
            _mockAuthService.Setup(s => s.GenerateEmailConfirmationTokenAsync(user))
                .ReturnsAsync("confirmation-token");
                
            _mockEmailService.Setup(s => s.SendEmailAsync(
                user.email,
                It.IsAny<string>(),
                It.IsAny<string>()))
                .Returns(Task.CompletedTask);

            
            var result = await _controller.Register(request, frontendHost);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(okResult.Value);
            Assert.Equal("Regisztráció sikeres. Kérjük erősítse meg email címét.", errorModel.errorMessage);
            
            _mockEmailService.Verify(s => s.SendEmailAsync(
                user.email,
                "Erősítse meg email címét",
                It.Is<string>(body => body.Contains(frontendHost) && body.Contains("confirm-email"))),
                Times.Once);
        }

        #endregion

        #region Email Confirmation Tests

        [Fact]
        public async Task ConfirmEmail_WithValidToken_ConfirmsEmail_AndLogsIn()
        {
            
            var userId = 1;
            var token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes("valid-token"));
            var user = new User { userID = userId, email = "test@example.com" };
            var tokenResponse = new TokenResponse { AccessToken = "valid-token", RefreshToken = "valid-refresh-token" };
            
            _mockAuthService.Setup(s => s.ConfirmEmailAsync(userId, "valid-token"))
                .ReturnsAsync(true);
                
            _mockAuthService.Setup(s => s.GetUserAsync(userId))
                .ReturnsAsync(user);
                
            _mockAuthService.Setup(s => s.CreateTokenResponse(user))
                .ReturnsAsync(tokenResponse);
                
            _mockAuthService.Setup(s => s.SetTokensInsideCookie(tokenResponse, _httpContext))
                .Returns(Task.CompletedTask);

            
            var result = await _controller.ConfirmEmail(userId, token);

            
            var okResult = Assert.IsType<OkObjectResult>(result);
            var errorModel = Assert.IsType<ErrorModel>(okResult.Value);
            Assert.Equal("Email cím megerősítve!", errorModel.errorMessage);
            
            _mockAuthService.Verify(s => s.SetTokensInsideCookie(tokenResponse, _httpContext), Times.Once);
        }

        [Fact]
        public async Task ConfirmEmail_WithInvalidToken_ReturnsBadRequest()
        {
            
            var userId = 1;
            var token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes("invalid-token"));
            
            _mockAuthService.Setup(s => s.ConfirmEmailAsync(userId, "invalid-token"))
                .ReturnsAsync(false);

            
            var result = await _controller.ConfirmEmail(userId, token);

            
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("Érvénytelen vagy lejárt token.", errorModel.errorMessage);
        }

        [Fact]
        public async Task ConfirmEmail_WhenExceptionOccurs_ReturnsBadRequest()
        {
            
            var userId = 1;
            var token = "invalid-base64";
            
            
            var result = await _controller.ConfirmEmail(userId, token);

            
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("Hiba történt a megerősítés során.", errorModel.errorMessage);
        }

        #endregion

        #region Two-Factor Authentication Tests

        [Fact]
        public async Task VerifyEmail2FA_WithValidCode_LogsInUser()
        {
            
            var request = new VerifyEmail2FADto { UserId = 1, Code = "123456" };
            var user = new User { userID = 1, email = "test@example.com" };
            var tokenResponse = new TokenResponse { AccessToken = "valid-token", RefreshToken = "valid-refresh-token" };
            
            _mockAuthService.Setup(s => s.VerifyEmail2FACodeAsync(request.UserId, request.Code))
                .ReturnsAsync(true);
                
            _mockAuthService.Setup(s => s.GetUserAsync(request.UserId))
                .ReturnsAsync(user);
                
            _mockAuthService.Setup(s => s.CreateTokenResponse(user))
                .ReturnsAsync(tokenResponse);
                
            _mockAuthService.Setup(s => s.SetTokensInsideCookie(tokenResponse, _httpContext))
                .Returns(Task.CompletedTask);

            
            var result = await _controller.VerifyEmail2FA(request);

            
            Assert.IsType<OkResult>(result);
            _mockAuthService.Verify(s => s.SetTokensInsideCookie(tokenResponse, _httpContext), Times.Once);
        }

        [Fact]
