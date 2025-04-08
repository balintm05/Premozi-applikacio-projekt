using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Services;

public class PasswordResetTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly AuthController _controller;

    public PasswordResetTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _controller = new AuthController(_authServiceMock.Object);
    }

    [Fact]
    public async Task VerifyPasswordResetToken_ReturnsValid_WhenTokenIsGood()
    {
        
        var request = new { userId = 1, token = "valid-token" };
        _authServiceMock.Setup(x => x.VerifyPasswordResetToken(request.userId, request.token))
            .ReturnsAsync(new { valid = true });

        
        var result = await _controller.VerifyPasswordResetToken(request.userId, request.token);

        
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.True((bool)okResult.Value.GetType().GetProperty("valid").GetValue(okResult.Value));
    }

    [Fact]
    public async Task CompletePasswordReset_ReturnsSuccess_WithValidData()
    {
        
        var request = new { userId = 1, token = "valid-token", newPassword = "newPassword123" };
        _authServiceMock.Setup(x => x.CompletePasswordReset(request.userId, request.token, request.newPassword))
            .ReturnsAsync(new { success = true });

        
        var result = await _controller.CompletePasswordReset(request);

        
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.True((bool)okResult.Value.GetType().GetProperty("success").GetValue(okResult.Value));
    }
}