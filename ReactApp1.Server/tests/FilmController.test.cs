using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Moq;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Models.Film;
using ReactApp1.Server.Models.Film.ManageFilm;
using ReactApp1.Server.Models;
using ReactApp1.Server.Services.Film;
using Xunit;
using System.Collections.Generic;
using System.Threading.Tasks;
using ReactApp1.Server.Entities;


namespace ReactApp1.Server.Tests.Controllers
{
    public class FilmControllerTests
    {
        private readonly Mock<IFilmService> _mockFilmService;
        private readonly FilmController _controller;
        private readonly DefaultHttpContext _httpContext;

        public FilmControllerTests()
        {
            _mockFilmService = new Mock<IFilmService>();
            _controller = new FilmController(_mockFilmService.Object);
            _httpContext = new DefaultHttpContext();
            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = _httpContext
            };
        }

        [Fact]
        public async Task QueryFilm_ReturnsOkResult_WithValidRequest()
        {
            // Arrange
            var request = new GetFilmQueryFilter();
            var expectedFilms = new List<Film>();
            _mockFilmService.Setup(x => x.queryFilm(request)).ReturnsAsync(expectedFilms);

            // Act
            var result = await _controller.QueryFilm(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedFilms, okResult.Value);
        }

        [Fact]
        public async Task QueryFilm_ReturnsBadRequest_WhenServiceReturnsNull()
        {
            // Arrange
            var request = new GetFilmQueryFilter();
            _mockFilmService.Setup(x => x.queryFilm(request)).ReturnsAsync((List<Film>)null);

            // Act
            var result = await _controller.QueryFilm(request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task GetFilm_WithoutId_ReturnsOkResult()
        {
            // Arrange
            var expectedFilms = new List<Film>();
            _mockFilmService.Setup(x => x.getFilm()).ReturnsAsync(expectedFilms);

            // Act
            var result = await _controller.GetFilm();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedFilms, okResult.Value);
        }

        [Fact]
        public async Task GetFilm_WithId_ReturnsOkResult_WhenFilmExists()
        {
            // Arrange
            int filmId = 1;
            var expectedFilm = new Film();
            _mockFilmService.Setup(x => x.getFilm(filmId)).ReturnsAsync(expectedFilm);

            // Act
            var result = await _controller.GetFilm(filmId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedFilm, okResult.Value);
        }

        [Fact]
        public async Task GetFilm_WithId_ReturnsBadRequest_WhenFilmDoesNotExist()
        {
            // Arrange
            int filmId = 1;
            _mockFilmService.Setup(x => x.getFilm(filmId)).ReturnsAsync((Film)null);

            // Act
            var result = await _controller.GetFilm(filmId);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task AddFilm_ReturnsOkResult_WhenSuccessful()
        {
            // Arrange
            var request = new ManageFilmDto();
            var successResponse = new ErrorModel("Sikeres hozzáadás");
            _mockFilmService.Setup(x => x.addFilm(request, It.IsAny<HttpContext>())).ReturnsAsync(successResponse);

            // Act
            var result = await _controller.AddFilm(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(successResponse, okResult.Value);
        }

        [Fact]
        public async Task AddFilm_ReturnsBadRequest_WhenUnsuccessful()
        {
            // Arrange
            var request = new ManageFilmDto();
            var errorResponse = new ErrorModel("Hiba történt");
            _mockFilmService.Setup(x => x.addFilm(request, It.IsAny<HttpContext>())).ReturnsAsync(errorResponse);

            // Act
            var result = await _controller.AddFilm(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task EditFilm_ReturnsOkResult_WhenSuccessful()
        {
            // Arrange
            var request = new ManageFilmDto();
            var successResponse = new ErrorModel("Sikeres módosítás");
            _mockFilmService.Setup(x => x.editFilm(request, It.IsAny<HttpContext>())).ReturnsAsync(successResponse);

            // Act
            var result = await _controller.EditFilm(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(successResponse, okResult.Value);
        }

        [Fact]
        public async Task EditFilm_ReturnsBadRequest_WhenUnsuccessful()
        {
            // Arrange
            var request = new ManageFilmDto();
            var errorResponse = new ErrorModel("Hiba történt");
            _mockFilmService.Setup(x => x.editFilm(request, It.IsAny<HttpContext>())).ReturnsAsync(errorResponse);

            // Act
            var result = await _controller.EditFilm(request);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task DeleteFilm_ReturnsOkResult_WhenSuccessful()
        {
            // Arrange
            int filmId = 1;
            var successResponse = new ErrorModel("Sikeres törlés");
            _mockFilmService.Setup(x => x.deleteFilm(filmId)).ReturnsAsync(successResponse);

            // Act
            var result = await _controller.DeleteFilm(filmId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(successResponse, okResult.Value);
        }

        [Fact]
        public async Task DeleteFilm_ReturnsBadRequest_WhenUnsuccessful()
        {
            // Arrange
            int filmId = 1;
            var errorResponse = new ErrorModel("Hiba történt");
            _mockFilmService.Setup(x => x.deleteFilm(filmId)).ReturnsAsync(errorResponse);

            // Act
            var result = await _controller.DeleteFilm(filmId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }
    }
}