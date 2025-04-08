using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Services;

public class ChangeEmailTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly AuthController _controller;

    public ChangeEmailTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _controller = new AuthController(_authServiceMock.Object);
    }

    [Fact]
    public async Task ChangeEmail_ReturnsSuccess_WithValidData()
    {
        
        var request = new { email = "new@example.com", currentPassword = "validPass123" };
        _authServiceMock.Setup(x => x.ChangeEmail(It.IsAny<int>(), request.email, request.currentPassword))
            .ReturnsAsync(new { success = true });

        
        var result = await _controller.ChangeEmail(request);

        
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.True((bool)okResult.Value.GetType().GetProperty("success").GetValue(okResult.Value));
    }

    [Fact]
    public async Task ChangeEmail_ReturnsError_WhenEmailExists()
    {
        
        var request = new { email = "exists@example.com", currentPassword = "validPass123" };
        _authServiceMock.Setup(x => x.ChangeEmail(It.IsAny<int>(), request.email, request.currentPassword))
            .ReturnsAsync(new { success = false, errorMessage = "Email already in use" });

        
        var result = await _controller.ChangeEmail(request);

        
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.False((bool)okResult.Value.GetType().GetProperty("success").GetValue(okResult.Value));
        Assert.Equal("Email already in use", okResult.Value.GetType().GetProperty("errorMessage").GetValue(okResult.Value));
    }
}