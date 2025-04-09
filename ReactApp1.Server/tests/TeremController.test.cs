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
        public async Task GetTerem_ReturnsListOfTerem()
        {
            // Arrange
            var expectedTeremList = new List<GetTeremResponse>
            {
                new GetTeremResponse { Id = 1, Nev = "Terem 1" },
                new GetTeremResponse { Id = 2, Nev = "Terem 2" }
            };

            _mockTeremService.Setup(x => x.getTerem())
                .ReturnsAsync(expectedTeremList);

            // Act
            var result = await _controller.GetTerem();

            // Assert
            var actionResult = Assert.IsType<ActionResult<List<GetTeremResponse>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(expectedTeremList, okResult.Value);
        }

        [Fact]
        public async Task GetTerem_WithId_ReturnsTerem_WhenExists()
        {
            // Arrange
            var expectedTerem = new GetTeremResponse
            {
                Id = 1,
                Nev = "Terem 1",
                error = null
            };

            _mockTeremService.Setup(x => x.getTerem(1))
                .ReturnsAsync(expectedTerem);

            // Act
            var result = await _controller.GetTerem(1);

            // Assert
            var actionResult = Assert.IsType<ActionResult<GetTeremResponse>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(expectedTerem, okResult.Value);
        }

        [Fact]
        public async Task GetTerem_WithId_ReturnsBadRequest_WhenError()
        {
            // Arrange
            var errorResponse = new GetTeremResponse
            {
                error = new ErrorModel("Nem található terem")
            };

            _mockTeremService.Setup(x => x.getTerem(1))
                .ReturnsAsync(errorResponse);

            // Act
            var result = await _controller.GetTerem(1);

            // Assert
            var actionResult = Assert.IsType<ActionResult<GetTeremResponse>>(result);
            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task AddTerem_ReturnsOk_WhenSuccessful()
        {
            // Arrange
            var request = new ManageTeremDto { Nev = "Új terem" };
            var successResponse = new ErrorModel("Sikeres hozzáadás");

            _mockTeremService.Setup(x => x.addTerem(request))
                .ReturnsAsync(successResponse);

            // Act
            var result = await _controller.AddTerem(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(successResponse, okResult.Value);
        }

        [Fact]
        public async Task AddTerem_ReturnsBadRequest_WhenUnsuccessful()
        {
            // Arrange
            var request = new ManageTeremDto { Nev = "Új terem" };
            var errorResponse = new ErrorModel("Hiba történt");

            _mockTeremService.Setup(x => x.addTerem(request))
                .ReturnsAsync(errorResponse);

            // Act
            var result = await _controller.AddTerem(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task EditTerem_ReturnsOk_WhenSuccessful()
        {
            // Arrange
            var request = new ManageTeremDto { Id = 1, Nev = "Módosított terem" };
            var successResponse = new ErrorModel("Sikeres módosítás");

            _mockTeremService.Setup(x => x.editTerem(request))
                .ReturnsAsync(successResponse);

            // Act
            var result = await _controller.EditTerem(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(successResponse, okResult.Value);
        }

        [Fact]
        public async Task EditTerem_ReturnsBadRequest_WhenUnsuccessful()
        {
            // Arrange
            var request = new ManageTeremDto { Id = 1, Nev = "Módosított terem" };
            var errorResponse = new ErrorModel("Hiba történt");

            _mockTeremService.Setup(x => x.editTerem(request))
                .ReturnsAsync(errorResponse);

            // Act
            var result = await _controller.EditTerem(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
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