using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Services;
using NUnit.Framework;

public class Enable2FATests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly AuthController _controller;

    public Enable2FATests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _controller = new AuthController(_authServiceMock.Object);
    }

    [Fact]
    public async Task Enable2FA_ReturnsSuccess_WhenEnabled()
    {
        _authServiceMock.Setup(x => x.EnableEmail2FA(It.IsAny<int>()))
            .ReturnsAsync(new { success = true });

        var result = await _controller.EnableEmail2FA();

        
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.True((bool)okResult.Value.GetType().GetProperty("success").GetValue(okResult.Value));
    }

    [Fact]
    public async Task Disable2FA_ReturnsSuccess_WithValidPassword()
    {
        
        var request = new { userId = 1, password = "validPassword" };
        _authServiceMock.Setup(x => x.DisableEmail2FA(request.userId, request.password))
            .ReturnsAsync(new { success = true });

        
        var result = await _controller.DisableEmail2FA(request);

        
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.True((bool)okResult.Value.GetType().GetProperty("success").GetValue(okResult.Value));
    }

    [Fact]
    public async Task Check2FAStatus_ReturnsCorrectStatus()
    {
        
        _authServiceMock.Setup(x => x.Get2FAStatus(It.IsAny<int>()))
            .ReturnsAsync(new { twoFactorEnabled = true });

        
        var result = await _controller.Check2FAStatus();

        
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.True((bool)okResult.Value.GetType().GetProperty("twoFactorEnabled").GetValue(okResult.Value));
    }
}