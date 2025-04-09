using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Moq;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Models;
using ReactApp1.Server.Services.Foglalas;
using Xunit;
using System.Collections.Generic;
using System.Threading.Tasks;
using ReactApp1.Server.Models.Foglalas;
using ReactApp1.Server.Models.Rendeles;
using ReactApp1.Server.Entities.Foglalas;

namespace ReactApp1.Server.Tests.Controllers
{
    public class FoglalasControllerTests
    {
        private readonly Mock<IFoglalasService> _mockFoglalasService;
        private readonly FoglalasController _controller;
        private readonly DefaultHttpContext _httpContext;

        public FoglalasControllerTests()
        {
            _mockFoglalasService = new Mock<IFoglalasService>();
            _controller = new FoglalasController(_mockFoglalasService.Object);
            _httpContext = new DefaultHttpContext();
            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = _httpContext
            };
        }

        [Fact]
        public async Task GetJegyTipus_ReturnsListOfJegyTipus()
        {
            // Arrange
            var expectedJegyTipusok = new List<JegyTipus>();
            _mockFoglalasService.Setup(x => x.getJegyTipusok())
                .Returns(Task.FromResult(expectedJegyTipusok));

            // Act
            var result = await _controller.GetJegyTipus();

            // Assert
            var actionResult = Assert.IsType<ActionResult<List<JegyTipus>>>(result);
            Assert.NotEqual(expectedJegyTipusok, actionResult);
        }

        [Fact]
        public async Task GetFoglalas_AdminRole_ReturnsListOfFoglalas()
        {
            // Arrange
            var expectedFoglalasok = new List<GetFoglalasResponse>();
            _mockFoglalasService.Setup(x => x.GetFoglalas())
                .Returns(Task.FromResult(expectedFoglalasok));

            // Act
            var result = await _controller.GetFoglalas();

            // Assert
            var actionResult = Assert.IsType<ActionResult<List<GetFoglalasResponse>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(expectedFoglalasok, okResult.Value);
        }

        [Fact]
        public async Task GetFoglalasByVetites_ReturnsListOfFoglalas_WhenExists()
        {
            // Arrange
            int vetitesId = 1;
            var expectedFoglalasok = new List<GetFoglalasResponse>();
            _mockFoglalasService.Setup(x => x.GetFoglalasByVetites(vetitesId))
                .Returns(Task.FromResult(expectedFoglalasok));

            // Act
            var result = await _controller.GetFoglalasByVetites(vetitesId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<List<GetFoglalasResponse>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(expectedFoglalasok, okResult.Value);
        }

        [Fact]
        public async Task GetFoglalasByVetites_ReturnsBadRequest_WhenNotFound()
        {
            // Arrange
            int vetitesId = 1;
            _mockFoglalasService.Setup(x => x.GetFoglalasByVetites(vetitesId))
                .Returns(Task.FromResult<List<GetFoglalasResponse>>(null));

            // Act
            var result = await _controller.GetFoglalasByVetites(vetitesId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<List<GetFoglalasResponse>>>(result);
            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task GetFoglalasByUser_ReturnsListOfFoglalas_WhenExists()
        {
            // Arrange
            int userId = 1;
            var expectedFoglalasok = new List<GetFoglalasResponse>();
            _mockFoglalasService.Setup(x => x.GetFoglalasByUser(userId))
                .Returns(Task.FromResult(expectedFoglalasok));

            // Act
            var result = await _controller.GetFoglalasByUser(userId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<List<GetFoglalasResponse>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(expectedFoglalasok, okResult.Value);
        }

        [Fact]
        public async Task GetFoglalasByUser_ReturnsBadRequest_WhenNotFound()
        {
            // Arrange
            int userId = 1;
            _mockFoglalasService.Setup(x => x.GetFoglalasByUser(userId))
                .Returns(Task.FromResult<List<GetFoglalasResponse>>(null));

            // Act
            var result = await _controller.GetFoglalasByUser(userId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<List<GetFoglalasResponse>>>(result);
            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task AddFoglalas_ReturnsOkResult_WhenSuccessful()
        {
            // Arrange
            var request = new ManageFoglalasDto();
            var successResponse = new ErrorModel("Sikeres hozzáadás");
            _mockFoglalasService.Setup(x => x.addFoglalas(request))
                .Returns(Task.FromResult(successResponse));

            // Act
            var result = await _controller.AddFoglalas(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(successResponse, okResult.Value);
        }

        [Fact]
        public async Task AddFoglalas_ReturnsBadRequest_WhenUnsuccessful()
        {
            // Arrange
            var request = new ManageFoglalasDto();
            var errorResponse = new ErrorModel("Hiba történt");
            _mockFoglalasService.Setup(x => x.addFoglalas(request))
                .Returns(Task.FromResult(errorResponse));

            // Act
            var result = await _controller.AddFoglalas(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task EditFoglalas_ReturnsOkResult_WhenSuccessful()
        {
            // Arrange
            var request = new ManageFoglalasDto();
            var successResponse = new ErrorModel("Sikeres módosítás");
            _mockFoglalasService.Setup(x => x.editFoglalas(request))
                .Returns(Task.FromResult(successResponse));

            // Act
            var result = await _controller.EditFoglalas(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(successResponse, okResult.Value);
        }

        [Fact]
        public async Task EditFoglalas_ReturnsBadRequest_WhenUnsuccessful()
        {
            // Arrange
            var request = new ManageFoglalasDto();
            var errorResponse = new ErrorModel("Hiba történt");
            _mockFoglalasService.Setup(x => x.editFoglalas(request))
                .Returns(Task.FromResult(errorResponse));

            // Act
            var result = await _controller.EditFoglalas(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task DeleteFoglalas_ReturnsOkResult_WhenSuccessful()
        {
            // Arrange
            int foglalasId = 1;
            var successResponse = new ErrorModel("Sikeres törlés");
            _mockFoglalasService.Setup(x => x.deleteFoglalas(foglalasId))
                .Returns(Task.FromResult(successResponse));

            // Act
            var result = await _controller.DeleteFoglalas(foglalasId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(successResponse, okResult.Value);
        }

        [Fact]
        public async Task DeleteFoglalas_ReturnsBadRequest_WhenUnsuccessful()
        {
            // Arrange
            int foglalasId = 1;
            var errorResponse = new ErrorModel("Hiba történt");
            _mockFoglalasService.Setup(x => x.deleteFoglalas(foglalasId))
                .Returns(Task.FromResult(errorResponse));

            // Act
            var result = await _controller.DeleteFoglalas(foglalasId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }
    }
}