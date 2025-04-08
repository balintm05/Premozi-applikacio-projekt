using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Services;

public class TwoFactorAuthTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly AuthController _controller;

    public TwoFactorAuthTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _controller = new AuthController(_authServiceMock.Object);
    }

    [Fact]
    public async Task Verify2FA_ReturnsSuccess_WithValidCode()
    {
        
        var request = new { userId = 1, code = "123456" };
        _authServiceMock.Setup(x => x.Verify2FACode(request.userId, request.code))
            .ReturnsAsync(new { success = true });

        
        var result = await _controller.Verify2FA(request);

        
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.True((bool)okResult.Value.GetType().GetProperty("success").GetValue(okResult.Value));
    }

    [Fact]
    public async Task Resend2FACode_ReturnsSuccess()
    {
        
        var userId = 1;
        _authServiceMock.Setup(x => x.Resend2FACode(userId))
            .ReturnsAsync(new { success = true });

        
        var result = await _controller.Resend2FACode(userId);

        
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.True((bool)okResult.Value.GetType().GetProperty("success").GetValue(okResult.Value));
    }
}