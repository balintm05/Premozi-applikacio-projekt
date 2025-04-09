using Microsoft.AspNetCore.Mvc;
using Moq;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models.Vetites;
using ReactApp1.Server.Services.Vetites;
using Xunit;

namespace ReactApp1.Server.Tests.Controllers
{
    public class VetitesControllerTests
    {
        private readonly Mock<IVetitesService> _mockVetitesService;
        private readonly VetitesController _controller;

        public VetitesControllerTests()
        {
            _mockVetitesService = new Mock<IVetitesService>();
            _controller = new VetitesController(_mockVetitesService.Object);
        }

        [Fact]
        public async Task EditVetites_ReturnsOk_WhenSuccessful()
        {
            // Arrange
            var request = new ManageVetitesDto
            {
                /*id = 1,
                film = 1,
                terem = 1,
                idopont = DateTime.Now.AddHours(3).ToString()*/
            };

            var successResponse = new ErrorModel("Sikeres módosítás");

            _mockVetitesService.Setup(x => x.editVetites(request))
                .ReturnsAsync(successResponse);

            // Act
            var result = await _controller.EditVetites(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var response = Assert.IsType<ErrorModel>(okResult.Value);
            Assert.Equal("Sikeres módosítás", response.errorMessage);
        }

        [Fact]
        public async Task EditVetites_ReturnsBadRequest_WhenUnsuccessful()
        {
            // Arrange
            var request = new ManageVetitesDto
            {
                /*id = 999,
                film = 1,
                terem = 1,
                idopont = DateTime.Now.AddHours(3).ToString()*/
            };

            var errorResponse = new ErrorModel("Nem található vetítés");

            _mockVetitesService.Setup(x => x.editVetites(request))
                .ReturnsAsync(errorResponse);

            // Act
            var result = await _controller.EditVetites(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var response = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("Nem található vetítés", response.errorMessage);
        }

        [Fact]
        public async Task DeleteVetites_ReturnsOk_WhenSuccessful()
        {
            // Arrange
            var vetitesId = 1;
            var successResponse = new ErrorModel("Sikeres törlés");

            _mockVetitesService.Setup(x => x.deleteVetites(vetitesId))
                .ReturnsAsync(successResponse);

            // Act
            var result = await _controller.DeleteVetites(vetitesId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var response = Assert.IsType<ErrorModel>(okResult.Value);
            Assert.Equal("Sikeres törlés", response.errorMessage);
        }

        [Fact]
        public async Task DeleteVetites_ReturnsBadRequest_WhenUnsuccessful()
        {
            // Arrange
            var vetitesId = 999;
            var errorResponse = new ErrorModel("Nem található vetítés");

            _mockVetitesService.Setup(x => x.deleteVetites(vetitesId))
                .ReturnsAsync(errorResponse);

            // Act
            var result = await _controller.DeleteVetites(vetitesId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var response = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("Nem található vetítés", response.errorMessage);
        }
    }
}