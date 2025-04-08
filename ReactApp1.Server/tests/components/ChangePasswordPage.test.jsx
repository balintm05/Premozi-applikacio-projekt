using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Services;

public class ChangePasswordTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly AuthController _controller;

    public ChangePasswordTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _controller = new AuthController(_authServiceMock.Object);
    }

    [Fact]
    public async Task ChangePassword_ReturnsSuccess_WithValidData()
    {
        
        var request = new { currentPassword = "oldPass123", newPassword = "newPass123" };
        _authServiceMock.Setup(x => x.ChangePassword(It.IsAny<int>(), request.currentPassword, request.newPassword))
            .ReturnsAsync(new { success = true });

        
        var result = await _controller.ChangePassword(request);

        
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.True((bool)okResult.Value.GetType().GetProperty("success").GetValue(okResult.Value));
    }

    [Fact]
    public async Task ChangePassword_ReturnsError_WhenCurrentPasswordWrong()
    {
        
        var request = new { currentPassword = "wrongPass", newPassword = "newPass123" };
        _authServiceMock.Setup(x => x.ChangePassword(It.IsAny<int>(), request.currentPassword, request.newPassword))
            .ReturnsAsync(new { success = false, errorMessage = "Current password is incorrect" });

        
        var result = await _controller.ChangePassword(request);

        
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.False((bool)okResult.Value.GetType().GetProperty("success").GetValue(okResult.Value));
        Assert.Equal("Current password is incorrect", okResult.Value.GetType().GetProperty("errorMessage").GetValue(okResult.Value));
    }
}