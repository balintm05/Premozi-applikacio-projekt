using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models.Vetites;
using ReactApp1.Server.Services.Vetites;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

namespace ReactApp1.Server.Tests.Controllers
{
    public class VetitesControllerTests
    {
        private readonly Mock<IVetitesService> _mockVetitesService;
        private readonly VetitesController _controller;
        private readonly DefaultHttpContext _httpContext;

        public VetitesControllerTests()
        {
            _mockVetitesService = new Mock<IVetitesService>();
            _controller = new VetitesController(_mockVetitesService.Object);
            
            _httpContext = new DefaultHttpContext();
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = _httpContext
            };
        }

        #region GetVetites Tests

        [Fact]
        public async Task GetVetites_WithNoId_ReturnsAllVetitesek()
        {
            
            var vetitesek = new List<GetVetitesResponse>
            {
                new GetVetitesResponse { id = 1, filmId = 1, teremId = 1, idopont = System.DateTime.Now.AddDays(1) },
                new GetVetitesResponse { id = 2, filmId = 2, teremId = 2, idopont = System.DateTime.Now.AddDays(2) }
            };
            
            _mockVetitesService.Setup(s => s.getVetites())
                .ReturnsAsync(vetitesek);

            
            var result = await _controller.GetVetites();

            
            var actionResult = Assert.IsType<ActionResult<List<GetVetitesResponse>>>(result);
            var returnValue = Assert.IsType<List<GetVetitesResponse>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count);
            Assert.Equal(1, returnValue[0].id);
            Assert.Equal(2, returnValue[1].id);
        }

        [Fact]
        public async Task GetVetites_WithNoId_WhenServiceReturnsEmptyList_ReturnsEmptyList()
        {
            
            _mockVetitesService.Setup(s => s.getVetites())
                .ReturnsAsync(new List<GetVetitesResponse>());

            
            var result = await _controller.GetVetites();

            
            var actionResult = Assert.IsType<ActionResult<List<GetVetitesResponse>>>(result);
            var returnValue = Assert.IsType<List<GetVetitesResponse>>(actionResult.Value);
            Assert.Empty(returnValue);
        }

        [Fact]
        public async Task GetVetites_WithValidId_ReturnsVetites()
        {
            
            var vetitesId = 1;
            var vetitesResponse = new GetVetitesResponseWithError
            {
                vetites = new List<GetVetitesResponse>
                {
                    new GetVetitesResponse { id = vetitesId, filmId = 1, teremId = 1, idopont = System.DateTime.Now.AddDays(1) }
                },
                Error = null
            };
            
            _mockVetitesService.Setup(s => s.getVetites(vetitesId))
                .ReturnsAsync(vetitesResponse);

            
            var result = await _controller.GetVetites(vetitesId);

            
            var actionResult = Assert.IsType<ActionResult<List<GetVetitesResponse>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnValue = Assert.IsType<GetVetitesResponseWithError>(okResult.Value);
            Assert.Null(returnValue.Error);
            Assert.Single(returnValue.vetites);
            Assert.Equal(vetitesId, returnValue.vetites[0].id);
        }

        [Fact]
        public async Task GetVetites_WithInvalidId_ReturnsBadRequest()
        {
            
            var vetitesId = 999;
            var errorResponse = new GetVetitesResponseWithError
            {
                Error = new ErrorModel("A vetítés nem található")
            };
            
            _mockVetitesService.Setup(s => s.getVetites(vetitesId))
                .ReturnsAsync(errorResponse);

            
            var result = await _controller.GetVetites(vetitesId);

            
            var actionResult = Assert.IsType<ActionResult<List<GetVetitesResponse>>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var returnValue = Assert.IsType<GetVetitesResponseWithError>(badRequestResult.Value);
            Assert.NotNull(returnValue.Error);
            Assert.Equal("A vetítés nem található", returnValue.Error.errorMessage);
        }

        #endregion

        #region AddVetites Tests

        [Fact]
        public async Task AddVetites_WhenAdmin_AndSuccessful_ReturnsOkWithSuccessMessage()
        {
            
            SetupAdminUser();
            var request = new ManageVetitesDto 
            { 
                filmId = 1, 
                teremId = 1, 
                idopont = System.DateTime.Now.AddDays(7) 
            };
            
            _mockVetitesService.Setup(s => s.addVetites(request))
                .ReturnsAsync(new ErrorModel("Sikeres hozzáadás"));

            
            var result = await _controller.AddVetites(request);

            
            var actionResult = Assert.IsType<ActionResult<List<ErrorModel>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(okResult.Value);
            Assert.Equal("Sikeres hozzáadás", errorModel.errorMessage);
        }

        [Fact]
        public async Task AddVetites_WhenAdmin_AndFailed_ReturnsBadRequestWithErrorMessage()
        {
            
            SetupAdminUser();
            var request = new ManageVetitesDto 
            { 
                filmId = 999,
                teremId = 1, 
                idopont = System.DateTime.Now.AddDays(7) 
            };
            
            _mockVetitesService.Setup(s => s.addVetites(request))
                .ReturnsAsync(new ErrorModel("A film nem található"));

            
            var result = await _controller.AddVetites(request);

            
            var actionResult = Assert.IsType<ActionResult<List<ErrorModel>>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("A film nem található", errorModel.errorMessage);
        }

        [Fact]
        public async Task AddVetites_WhenAdmin_AndTeremNotFound_ReturnsBadRequestWithErrorMessage()
        {
            
            SetupAdminUser();
            var request = new ManageVetitesDto 
            { 
                filmId = 1, 
                teremId = 999, 
                idopont = System.DateTime.Now.AddDays(7) 
            };
            
            _mockVetitesService.Setup(s => s.addVetites(request))
                .ReturnsAsync(new ErrorModel("A terem nem található"));

            
            var result = await _controller.AddVetites(request);

            
            var actionResult = Assert.IsType<ActionResult<List<ErrorModel>>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("A terem nem található", errorModel.errorMessage);
        }

        [Fact]
        public async Task AddVetites_WhenAdmin_AndTimeConflict_ReturnsBadRequestWithErrorMessage()
        {
            
            SetupAdminUser();
            var request = new ManageVetitesDto 
            { 
                filmId = 1, 
                teremId = 1, 
                idopont = System.DateTime.Now.AddDays(1) 
            };
            
            _mockVetitesService.Setup(s => s.addVetites(request))
                .ReturnsAsync(new ErrorModel("A terem foglalt ebben az időpontban"));

            
            var result = await _controller.AddVetites(request);

            
            var actionResult = Assert.IsType<ActionResult<List<ErrorModel>>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("A terem foglalt ebben az időpontban", errorModel.errorMessage);
        }

        [Fact]
        public async Task AddVetites_WhenNotAdmin_ReturnsForbidden()
        {
            
            SetupRegularUser();
            var request = new ManageVetitesDto 
            { 
                filmId = 1, 
                teremId = 1, 
                idopont = System.DateTime.Now.AddDays(7) 
            };

             & Assert
            
        }

        #endregion

        #region EditVetites Tests

        [Fact]
        public async Task EditVetites_WhenAdmin_AndSuccessful_ReturnsOkWithSuccessMessage()
        {
            
            SetupAdminUser();
            var request = new ManageVetitesDto 
            { 
                id = 1,
                filmId = 1, 
                teremId = 2, 
                idopont = System.DateTime.Now.AddDays(8) 
            };
            
            _mockVetitesService.Setup(s => s.editVetites(request))
                .ReturnsAsync(new ErrorModel("Sikeres módosítás"));

            
            var result = await _controller.EditVetites(request);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(okResult.Value);
            Assert.Equal("Sikeres módosítás", errorModel.errorMessage);
        }

        [Fact]
        public async Task EditVetites_WhenAdmin_AndFailed_ReturnsBadRequestWithErrorMessage()
        {
            
            SetupAdminUser();
            var request = new ManageVetitesDto 
            { 
                id = 999, 
                filmId = 1, 
                teremId = 1, 
                idopont = System.DateTime.Now.AddDays(7) 
            };
            
            _mockVetitesService.Setup(s => s.editVetites(request))
                .ReturnsAsync(new ErrorModel("A vetítés nem található"));

            
            var result = await _controller.EditVetites(request);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("A vetítés nem található", errorModel.errorMessage);
        }

        [Fact]
        public async Task EditVetites_WhenAdmin_AndVetitesHasFoglalasok_ReturnsBadRequestWithErrorMessage()
        {
            
            SetupAdminUser();
            var request = new ManageVetitesDto 
            { 
                id = 2, 
                filmId = 1, 
                teremId = 1, 
                idopont = System.DateTime.Now.AddDays(10) 
            };
            
            _mockVetitesService.Setup(s => s.editVetites(request))
                .ReturnsAsync(new ErrorModel("A vetítés nem módosítható, mert vannak hozzá kapcsolódó foglalások"));

            
            var result = await _controller.EditVetites(request);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("A vetítés nem módosítható, mert vannak hozzá kapcsolódó foglalások", errorModel.errorMessage);
        }

        [Fact]
        public async Task EditVetites_WhenNotAdmin_ReturnsForbidden()
        {
            
            SetupRegularUser();
            var request = new ManageVetitesDto 
            { 
                id = 1,
                filmId = 1, 
                teremId = 1, 
                idopont = System.DateTime.Now.AddDays(7) 
            };

             & Assert
        }

        #endregion

        #region DeleteVetites Tests

        [Fact]
        public async Task DeleteVetites_WhenAdmin_AndSuccessful_ReturnsOkWithSuccessMessage()
        {
            
            SetupAdminUser();
            var vetitesId = 1;
            
            _mockVetitesService.Setup(s => s.deleteVetites(vetitesId))
                .ReturnsAsync(
