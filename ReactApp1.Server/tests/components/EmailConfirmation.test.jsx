using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Services;

public class EmailConfirmationTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly AuthController _controller;

    public EmailConfirmationTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _controller = new AuthController(_authServiceMock.Object);
    }

    [Fact]
    public async Task ConfirmEmail_ReturnsSuccess_WithValidToken()
    {
        
        var request = new { userId = 1, token = "valid-token" };
        _authServiceMock.Setup(x => x.ConfirmEmail(request.userId, request.token))
            .ReturnsAsync(new { success = true });

        
        var result = await _controller.ConfirmEmail(request.userId, request.token);

        
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.True((bool)okResult.Value.GetType().GetProperty("success").GetValue(okResult.Value));
    }

    [Fact]
    public async Task ConfirmEmail_ReturnsError_WithInvalidToken()
    {
        
        var request = new { userId = 1, token = "invalid-token" };
        _authServiceMock.Setup(x => x.ConfirmEmail(request.userId, request.token))
            .ThrowsAsync(new Exception("Invalid token"));

        
        var result = await _controller.ConfirmEmail(request.userId, request.token);

        
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Invalid token", badRequestResult.Value);
    }
}