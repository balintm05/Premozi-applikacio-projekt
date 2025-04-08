using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Moq;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Entities;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models.JWT;
using ReactApp1.Server.Models.User;
using ReactApp1.Server.Models.User.Response;
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
            var user = new User
            {
                email = email,
                EmailConfirmed = emailConfirmed,
                TwoFactorEnabled = twoFactorEnabled
            };

            typeof(User).GetProperty("userID")?.SetValue(user, id);
            return user;
        }

        [Fact]
        public async Task Register_ReturnsOk_WhenSuccessful()
        {
            /*// Arrange
            var request = new AuthUserDto { email = "test@test.com", password = "password" };

            var tokenResponse = new TokenResponseDto
            {
                Token = "test-token",
                RefreshToken = "test-refresh-token",
                Error = null
            };

            var user = CreateTestUser(1, "test@test.com");

            _mockAuthService.Setup(x => x.RegisterAsync(request))
                .ReturnsAsync(tokenResponse);

            _mockAuthService.Setup(x => x.GetUserByEmailAsync(request.email))
                .ReturnsAsync(user);

            // Act
            var result = await _controller.Register(request, "http://localhost");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = okResult.Value;

            // Check if the response is ErrorModel (based on your controller implementation)
            if (response is ErrorModel errorModel)
            {
                Assert.Equal("Regisztráció sikeres. Kérjük erősítse meg email címét.", errorModel.errorMessage);
            }
            else if (response is TokenResponseDto tokenResult)
            {
                Assert.Null(tokenResult.Error);
            }
            else
            {
                Assert.NotNull(response); // Basic check if we got something back
            }*/
            Assert.Null("response");
        }

        [Fact]
        public async Task ConfirmEmail_ReturnsOk_WhenTokenIsValid()
        {
            var userId = 1;
            var token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes("valid-token"));

            var user = CreateTestUser(userId, "test@test.com");
            var tokenResponse = new TokenResponseDto();

            _mockAuthService.Setup(x => x.ConfirmEmailAsync(userId, "valid-token"))
                .ReturnsAsync(true);

            _mockAuthService.Setup(x => x.GetUserAsync(userId))
                .ReturnsAsync(user);

            _mockAuthService.Setup(x => x.CreateTokenResponse(It.IsAny<User>()))
                .ReturnsAsync(tokenResponse);

            var result = await _controller.ConfirmEmail(userId, token);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var model = Assert.IsType<ErrorModel>(okResult.Value);
            Assert.Equal("Email cím megerősítve!", model.errorMessage);
        }

        [Fact]
        public async Task GetUser_ReturnsUser_WhenAuthenticated()
        {
            var claims = new[] { new Claim(ClaimTypes.NameIdentifier, "1") };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            var principal = new ClaimsPrincipal(identity);
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };

            var user = CreateTestUser(1, "test@test.com");

            _mockAuthService.Setup(x => x.GetUserAsync(It.IsAny<int>()))
                .ReturnsAsync(user);

            var result = await _controller.GetUser();

            var actionResult = Assert.IsType<ActionResult<GetUserResponseObject>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var userResponse = Assert.IsType<GetUserResponseObject>(okResult.Value);
            Assert.NotNull(userResponse);
        }

        [Fact]
        public async Task CheckIfLoggedIn_ReturnsCorrectState_WhenAuthenticated()
        {
            var claims = new[] { new Claim(ClaimTypes.NameIdentifier, "1") };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            var principal = new ClaimsPrincipal(identity);
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };

            var user = CreateTestUser(1, "test@test.com");

            _mockAuthService.Setup(x => x.GetUserAsync(It.IsAny<int>()))
                .ReturnsAsync(user);

            _mockAuthService.Setup(x => x.checkIfStatusChanged(It.IsAny<ClaimsPrincipal>(), It.IsAny<HttpContext>()))
                .ReturnsAsync(false);

            var result = await _controller.CheckIfLoggedIn();

            var actionResult = Assert.IsType<ActionResult<LoginState>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var loginState = Assert.IsType<LoginState>(okResult.Value);
            Assert.NotNull(loginState);
        }

        [Fact]
        public async Task DeleteUser_ReturnsForbidden_WhenNotAuthorized()
        {
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

            var result = await _controller.DeleteUser(1);

            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("Nincs jogosultsága törölni ezt a fiókot", errorModel.errorMessage);
        }
    }
}
