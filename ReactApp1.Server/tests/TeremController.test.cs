using Microsoft.AspNetCore.Mvc;
using Moq;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Models.Terem;
using ReactApp1.Server.Models;
using ReactApp1.Server.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace ReactApp1.Server.Tests.Controllers
{
    public class TeremControllerTests
    {
        private readonly Mock<ITeremService> _mockTeremService;
        private readonly TeremController _controller;

        public TeremControllerTests()
        {
            _mockTeremService = new Mock<ITeremService>();
            _controller = new TeremController(_mockTeremService.Object);
        }

        [Fact]
        public async Task DeleteTerem_ReturnsOk_WhenSuccessful()
        {
            // Arrange
            int teremId = 1;
            var successResponse = new ErrorModel("Sikeres törlés");

            _mockTeremService.Setup(x => x.deleteTerem(teremId))
                .ReturnsAsync(successResponse);

            // Act
            var result = await _controller.deleteTerem(teremId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(successResponse, okResult.Value);
        }

        [Fact]
        public async Task DeleteTerem_ReturnsBadRequest_WhenUnsuccessful()
        {
            // Arrange
            int teremId = 1;
            var errorResponse = new ErrorModel("Hiba történt");

            _mockTeremService.Setup(x => x.deleteTerem(teremId))
                .ReturnsAsync(errorResponse);

            // Act
            var result = await _controller.deleteTerem(teremId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }
    }
}