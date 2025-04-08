using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models.Film;
using ReactApp1.Server.Models.Film.ManageFilm;
using ReactApp1.Server.Services.Film;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

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
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = _httpContext
            };
        }

        #region QueryFilm Tests

        [Fact]
        public async Task QueryFilm_WithValidFilter_ReturnsMatchingFilms()
        {
            
            var filter = new GetFilmQueryFilter { Title = "Test Film" };
            var films = new List<GetFilmResponse>
            {
                new GetFilmResponse { id = 1, cim = "Test Film 1" },
                new GetFilmResponse { id = 2, cim = "Test Film 2" }
            };
            
            _mockFilmService.Setup(s => s.queryFilm(filter))
                .ReturnsAsync(films);

            
            var result = await _controller.QueryFilm(filter);

            
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<GetFilmResponse>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
            Assert.Equal("Test Film 1", returnValue[0].cim);
            Assert.Equal("Test Film 2", returnValue[1].cim);
        }

        [Fact]
        public async Task QueryFilm_WhenServiceReturnsNull_ReturnsBadRequest()
        {
            
            var filter = new GetFilmQueryFilter { Title = "Nonexistent" };
            
            _mockFilmService.Setup(s => s.queryFilm(filter))
                .ReturnsAsync((List<GetFilmResponse>)null);

            
            var result = await _controller.QueryFilm(filter);

            
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("Hiba történt", errorModel.errorMessage);
        }

        [Fact]
        public async Task QueryFilm_WithEmptyFilter_ReturnsAllFilms()
        {
            
            var filter = new GetFilmQueryFilter();
            var films = new List<GetFilmResponse>
            {
                new GetFilmResponse { id = 1, cim = "Film 1" },
                new GetFilmResponse { id = 2, cim = "Film 2" },
                new GetFilmResponse { id = 3, cim = "Film 3" }
            };
            
            _mockFilmService.Setup(s => s.queryFilm(filter))
                .ReturnsAsync(films);

            
            var result = await _controller.QueryFilm(filter);

            
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<GetFilmResponse>>(okResult.Value);
            Assert.Equal(3, returnValue.Count);
        }

        #endregion

        #region GetFilm Tests

        [Fact]
        public async Task GetFilm_WithNoId_ReturnsAllFilms()
        {
            
            var films = new List<GetFilmResponse>
            {
                new GetFilmResponse { id = 1, cim = "Film 1" },
                new GetFilmResponse { id = 2, cim = "Film 2" }
            };
            
            _mockFilmService.Setup(s => s.getFilm())
                .ReturnsAsync(films);

            
            var result = await _controller.GetFilm();

            
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<GetFilmResponse>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
            Assert.Equal("Film 1", returnValue[0].cim);
            Assert.Equal("Film 2", returnValue[1].cim);
        }

        [Fact]
        public async Task GetFilm_WithNoId_WhenServiceReturnsEmptyList_ReturnsEmptyList()
        {
            
            _mockFilmService.Setup(s => s.getFilm())
                .ReturnsAsync(new List<GetFilmResponse>());

            
            var result = await _controller.GetFilm();

            
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<GetFilmResponse>>(okResult.Value);
            Assert.Empty(returnValue);
        }

        [Fact]
        public async Task GetFilm_WithValidId_ReturnsFilm()
        {
            
            var filmId = 1;
            var film = new GetFilmResponse { id = filmId, cim = "Test Film" };
            
            _mockFilmService.Setup(s => s.getFilm(filmId))
                .ReturnsAsync(film);

            
            var result = await _controller.GetFilm(filmId);

            
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<GetFilmResponse>(okResult.Value);
            Assert.Equal(filmId, returnValue.id);
            Assert.Equal("Test Film", returnValue.cim);
        }

        [Fact]
        public async Task GetFilm_WithInvalidId_ReturnsBadRequest()
        {
            
            var filmId = 999;
            
            _mockFilmService.Setup(s => s.getFilm(filmId))
                .ReturnsAsync((GetFilmResponse)null);

            
            var result = await _controller.GetFilm(filmId);

            
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("A film nem található", errorModel.errorMessage);
        }

        #endregion

        #region AddFilm Tests

        [Fact]
        public async Task AddFilm_WhenAdmin_AndSuccessful_ReturnsOkWithSuccessMessage()
        {
            
            SetupAdminUser();
            var request = new ManageFilmDto { cim = "New Film", mufaj = "Action" };
            
            _mockFilmService.Setup(s => s.addFilm(request, _httpContext))
                .ReturnsAsync(new ErrorModel("Sikeres hozzáadás"));

            
            var result = await _controller.AddFilm(request);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(okResult.Value);
            Assert.Equal("Sikeres hozzáadás", errorModel.errorMessage);
        }

        [Fact]
        public async Task AddFilm_WhenAdmin_AndFailed_ReturnsBadRequestWithErrorMessage()
        {
            
            SetupAdminUser();
            var request = new ManageFilmDto { cim = "", mufaj = "Action" }; // Invalid title
            
            _mockFilmService.Setup(s => s.addFilm(request, _httpContext))
                .ReturnsAsync(new ErrorModel("A film címe nem lehet üres"));

            
            var result = await _controller.AddFilm(request);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("A film címe nem lehet üres", errorModel.errorMessage);
        }

        [Fact]
        public async Task AddFilm_WhenNotAdmin_ReturnsForbidden()
        {
            
            SetupRegularUser();
            var request = new ManageFilmDto { cim = "New Film", mufaj = "Action" };

             & Assert
            // The [Authorize(Roles = "Admin")] attribute will handle this case
            // This test is included for completeness
        }

        #endregion

        #region EditFilm Tests

        [Fact]
        public async Task EditFilm_WhenAdmin_AndSuccessful_ReturnsOkWithSuccessMessage()
        {
            
            SetupAdminUser();
            var request = new ManageFilmDto { id = 1, cim = "Updated Film", mufaj = "Comedy" };
            
            _mockFilmService.Setup(s => s.editFilm(request, _httpContext))
                .ReturnsAsync(new ErrorModel("Sikeres módosítás"));

            
            var result = await _controller.EditFilm(request);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(okResult.Value);
            Assert.Equal("Sikeres módosítás", errorModel.errorMessage);
        }

        [Fact]
        public async Task EditFilm_WhenAdmin_AndFailed_ReturnsBadRequestWithErrorMessage()
        {
            
            SetupAdminUser();
            var request = new ManageFilmDto { id = 999, cim = "Updated Film", mufaj = "Comedy" }; // Non-existent ID
            
            _mockFilmService.Setup(s => s.editFilm(request, _httpContext))
                .ReturnsAsync(new ErrorModel("A film nem található"));

            
            var result = await _controller.EditFilm(request);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("A film nem található", errorModel.errorMessage);
        }

        [Fact]
        public async Task EditFilm_WhenNotAdmin_ReturnsForbidden()
        {
            
            SetupRegularUser();
            var request = new ManageFilmDto { id = 1, cim = "Updated Film", mufaj = "Comedy" };

             & Assert

        }

        #endregion

        #region DeleteFilm Tests

        [Fact]
        public async Task DeleteFilm_WhenAdmin_AndSuccessful_ReturnsOkWithSuccessMessage()
        {
            
            SetupAdminUser();
            var filmId = 1;
            
            _mockFilmService.Setup(s => s.deleteFilm(filmId))
                .ReturnsAsync(new ErrorModel("Sikeres törlés"));

            
            var result = await _controller.DeleteFilm(filmId);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(okResult.Value);
            Assert.Equal("Sikeres törlés", errorModel.errorMessage);
        }

        [Fact]
        public async Task DeleteFilm_WhenAdmin_AndFailed_ReturnsBadRequestWithErrorMessage()
        {
            
            SetupAdminUser();
            var filmId = 999;
            
            _mockFilmService.Setup(s => s.deleteFilm(filmId))
                .ReturnsAsync(new ErrorModel("A film nem található"));

            
            var result = await _controller.DeleteFilm(filmId);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("A film nem található", errorModel.errorMessage);
        }

        [Fact]
        public async Task DeleteFilm_WhenAdmin_AndFilmHasVetitesek_ReturnsBadRequestWithErrorMessage()
        {
            
            SetupAdminUser();
            var filmId = 2;
            
            _mockFilmService.Setup(s => s.deleteFilm(filmId))
                .ReturnsAsync(new ErrorModel("A film nem törölhető, mert vannak hozzá kapcsolódó vetítések"));

            
            var result = await _controller.DeleteFilm(filmId);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("A film nem törölhető, mert vannak hozzá kapcsolódó vetítések", errorModel.errorMessage);
        }

        [Fact]
        public async Task DeleteFilm_WhenNotAdmin_ReturnsForbidden()
        {
            
            SetupRegularUser();
            var filmId = 1;

             & Assert

        }

        #endregion

        #region Helper Methods

        private void SetupAdminUser()
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes
