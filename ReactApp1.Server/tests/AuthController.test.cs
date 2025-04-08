using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Moq;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Entities;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models.JWT;
using ReactApp1.Server.Models.User;
using ReactApp1.Server.Services.Auth;
using ReactApp1.Server.Services.Email;
using System.Security.Claims;
using System.Text;
using Xunit;

namespace ReactApp1.Server.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _mockAuthService;
        private readonly Mock<IEmailService> _mockEmailService;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            _mockAuthService = new Mock<IAuthService>();
            _mockEmailService = new Mock<IEmailService>();
            _controller = new AuthController(_mockAuthService.Object, _mockEmailService.Object);
        }

        private User CreateTestUser(int id, string email, bool emailConfirmed = false, bool twoFactorEnabled = false)
        {
            return new User(id)
            {
                email = email,
                EmailConfirmed = emailConfirmed,
                TwoFactorEnabled = twoFactorEnabled
            };
        }

        [Fact]
        public async Task Login_ReturnsBadRequest_WhenUserAlreadyAuthenticated()
        {
            // Arrange
            var claims = new[] { new Claim(ClaimTypes.NameIdentifier, "1") };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            var principal = new ClaimsPrincipal(identity);
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };

            var request = new AuthUserDto { email = "test@test.com", password = "password" };

            // Act
            var result = await _controller.Login(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("Már be vagy jelentkezve", errorModel.errorMessage);
        }

        [Fact]
        public async Task Register_ReturnsOk_WhenSuccessful()
        {
            // Arrange
            var request = new AuthUserDto { email = "test@test.com", password = "password" };

            var tokenResponse = new TokenResponseDto { Error = null };
            var user = CreateTestUser(1, "test@test.com");

            _mockAuthService.Setup(x => x.RegisterAsync(request))
                .ReturnsAsync(tokenResponse);

            _mockAuthService.Setup(x => x.GetUserByEmailAsync(request.email))
                .ReturnsAsync(user);

            // Act
            var result = await _controller.Register(request, "http://localhost");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var errorModel = Assert.IsType<ErrorModel>(okResult.Value);
            Assert.Equal("Regisztráció sikeres. Kérjük erősítse meg email címét.", errorModel.errorMessage);
        }

        [Fact]
        public async Task ConfirmEmail_ReturnsOk_WhenTokenIsValid()
        {
            // Arrange
            var userId = 1;
            var token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes("valid-token"));

            var user = CreateTestUser(userId, "test@test.com");
            var tokenResponse = new TokenResponseDto();

            _mockAuthService.Setup(x => x.ConfirmEmailAsync(userId, "valid-token"))
                .ReturnsAsync(true);

            _mockAuthService.Setup(x => x.GetUserAsync(userId))
                .ReturnsAsync(user);

            _mockAuthService.Setup(x => x.CreateTokenResponse(user))
                .ReturnsAsync(tokenResponse);

            // Act
            var result = await _controller.ConfirmEmail(userId, token);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var errorModel = Assert.IsType<ErrorModel>(okResult.Value);
            Assert.Equal("Email cím megerősítve!", errorModel.errorMessage);
        }

        [Fact]
        public async Task GetUser_ReturnsUser_WhenAuthenticated()
        {
            // Arrange
            var claims = new[] { new Claim(ClaimTypes.NameIdentifier, "1") };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            var principal = new ClaimsPrincipal(identity);
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };

            var user = CreateTestUser(1, "test@test.com");

            _mockAuthService.Setup(x => x.GetUserAsync(1))
                .ReturnsAsync(user);

            // Act
            var result = await _controller.GetUser();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task CheckIfLoggedIn_ReturnsCorrectState_WhenAuthenticated()
        {
            // Arrange
            var claims = new[] { new Claim(ClaimTypes.NameIdentifier, "1") };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            var principal = new ClaimsPrincipal(identity);
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };

            var user = new User { userID = 1, email = "test@test.com" };

            _mockAuthService.Setup(x => x.GetUserAsync(1))
                .ReturnsAsync(user);

            _mockAuthService.Setup(x => x.checkIfStatusChanged(It.IsAny<ClaimsPrincipal>(), It.IsAny<HttpContext>()))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.CheckIfLoggedIn();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            dynamic loginState = okResult.Value;
            Assert.NotNull(loginState);
        }

        [Fact]
        public async Task DeleteUser_ReturnsForbidden_WhenNotAuthorized()
        {
            // Arrange
            var claims = new[] {
                new Claim(ClaimTypes.NameIdentifier, "2"),
                new Claim(ClaimTypes.Role, "User")
            };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            var principal = new ClaimsPrincipal(identity);
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };

            // Act
            var result = await _controller.DeleteUser(1);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("Nincs jogosultsága törölni ezt a fiókot", errorModel.errorMessage);
        }
    }
}