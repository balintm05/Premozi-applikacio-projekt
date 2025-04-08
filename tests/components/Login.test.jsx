using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Services;

public class LoginTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly AuthController _controller;

    public LoginTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _controller = new AuthController(_authServiceMock.Object);
    }

    [Fact]
    public async Task Login_ReturnsSuccess_WithValidCredentials()
    {
        
        var request = new { email = "test@example.com", password = "password" };
        _authServiceMock.Setup(x => x.Login(request.email, request.password))
            .ReturnsAsync(new { success = true });

        
        var result = await _controller.Login(request);

        
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.True((bool)okResult.Value.GetType().GetProperty("success").GetValue(okResult.Value));
    }

    [Fact]
    public async Task Login_Returns2FARequired_WhenEnabled()
    {
        
        var request = new { email = "test@example.com", password = "password" };
        _authServiceMock.Setup(x => x.Login(request.email, request.password))
            .ReturnsAsync(new { success = true, requires2FA = true, userId = 1 });

        
        var result = await _controller.Login(request);

        
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.True((bool)okResult.Value.GetType().GetProperty("requires2FA").GetValue(okResult.Value));
    }

    [Fact]
    public async Task Login_ReturnsError_WithInvalidCredentials()
    {
        
        var request = new { email = "wrong@example.com", password = "wrong" };
        _authServiceMock.Setup(x => x.Login(request.email, request.password))
            .ReturnsAsync(new { success = false, error = "Invalid credentials" });

        
        var result = await _controller.Login(request);

        
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.False((bool)okResult.Value.GetType().GetProperty("success").GetValue(okResult.Value));
        Assert.Equal("Invalid credentials", okResult.Value.GetType().GetProperty("error").GetValue(okResult.Value));
    }
}