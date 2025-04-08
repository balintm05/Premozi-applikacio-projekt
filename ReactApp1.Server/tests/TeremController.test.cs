using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models.Terem;
using ReactApp1.Server.Services;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

namespace ReactApp1.Server.Tests.Controllers
{
    public class TeremControllerTests
    {
        private readonly Mock<ITeremService> _mockTeremService;
        private readonly TeremController _controller;
        private readonly DefaultHttpContext _httpContext;

        public TeremControllerTests()
        {
            _mockTeremService = new Mock<ITeremService>();
            _controller = new TeremController(_mockTeremService.Object);
            
            _httpContext = new DefaultHttpContext();
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = _httpContext
            };
        }

        #region GetTerem Tests

        [Fact]
        public async Task GetTerem_WithNoId_ReturnsAllTermek()
        {
            
            var termek = new List<GetTeremResponse>
            {
                new GetTeremResponse { id = 1, nev = "Terem 1", sorokSzama = 10, oszlopokSzama = 15 },
                new GetTeremResponse { id = 2, nev = "Terem 2", sorokSzama = 8, oszlopokSzama = 12 }
            };
            
            _mockTeremService.Setup(s => s.getTerem())
                .ReturnsAsync(termek);

            
            var result = await _controller.GetTerem();

            
            var actionResult = Assert.IsType<ActionResult<List<GetTeremResponse>>>(result);
            var returnValue = Assert.IsType<List<GetTeremResponse>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count);
            Assert.Equal("Terem 1", returnValue[0].nev);
            Assert.Equal("Terem 2", returnValue[1].nev);
            Assert.Equal(10, returnValue[0].sorokSzama);
            Assert.Equal(8, returnValue[1].sorokSzama);
        }

        [Fact]
        public async Task GetTerem_WithNoId_WhenServiceReturnsEmptyList_ReturnsEmptyList()
        {
            
            _mockTeremService.Setup(s => s.getTerem())
                .ReturnsAsync(new List<GetTeremResponse>());

            
            var result = await _controller.GetTerem();

            
            var actionResult = Assert.IsType<ActionResult<List<GetTeremResponse>>>(result);
            var returnValue = Assert.IsType<List<GetTeremResponse>>(actionResult.Value);
            Assert.Empty(returnValue);
        }

        [Fact]
        public async Task GetTerem_WithValidId_ReturnsTerem()
        {
            
            var teremId = 1;
            var terem = new GetTeremResponse 
            { 
                id = teremId, 
                nev = "Terem 1", 
                sorokSzama = 10, 
                oszlopokSzama = 15,
                error = null
            };
            
            _mockTeremService.Setup(s => s.getTerem(teremId))
                .ReturnsAsync(terem);

            
            var result = await _controller.GetTerem(teremId);

            
            var actionResult = Assert.IsType<ActionResult<GetTeremResponse>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnValue = Assert.IsType<GetTeremResponse>(okResult.Value);
            Assert.Equal(teremId, returnValue.id);
            Assert.Equal("Terem 1", returnValue.nev);
            Assert.Equal(10, returnValue.sorokSzama);
            Assert.Equal(15, returnValue.oszlopokSzama);
        }

        [Fact]
        public async Task GetTerem_WithInvalidId_ReturnsBadRequest()
        {
            
            var teremId = 999;
            var errorResponse = new GetTeremResponse 
            { 
                error = new ErrorModel("A terem nem található") 
            };
            
            _mockTeremService.Setup(s => s.getTerem(teremId))
                .ReturnsAsync(errorResponse);

            
            var result = await _controller.GetTerem(teremId);

            
            var actionResult = Assert.IsType<ActionResult<GetTeremResponse>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var returnValue = Assert.IsType<GetTeremResponse>(badRequestResult.Value);
            Assert.NotNull(returnValue.error);
            Assert.Equal("A terem nem található", returnValue.error.errorMessage);
        }

        #endregion

        #region AddTerem Tests

        [Fact]
        public async Task AddTerem_WhenAdmin_AndSuccessful_ReturnsOkWithSuccessMessage()
        {
            
            SetupAdminUser();
            var request = new ManageTeremDto { nev = "Új Terem", sorokSzama = 12, oszlopokSzama = 18 };
            
            _mockTeremService.Setup(s => s.addTerem(request))
                .ReturnsAsync(new ErrorModel("Sikeres hozzáadás"));

            
            var result = await _controller.AddTerem(request);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(okResult.Value);
            Assert.Equal("Sikeres hozzáadás", errorModel.errorMessage);
        }

        [Fact]
        public async Task AddTerem_WhenAdmin_AndFailed_ReturnsBadRequestWithErrorMessage()
        {
            
            SetupAdminUser();
            var request = new ManageTeremDto { nev = "", sorokSzama = 12, oszlopokSzama = 18 }; // Invalid name
            
            _mockTeremService.Setup(s => s.addTerem(request))
                .ReturnsAsync(new ErrorModel("A terem neve nem lehet üres"));

            
            var result = await _controller.AddTerem(request);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("A terem neve nem lehet üres", errorModel.errorMessage);
        }

        [Fact]
        public async Task AddTerem_WhenAdmin_AndInvalidDimensions_ReturnsBadRequestWithErrorMessage()
        {
            
            SetupAdminUser();
            var request = new ManageTeremDto { nev = "Új Terem", sorokSzama = 0, oszlopokSzama = 18 }; // Invalid row count
            
            _mockTeremService.Setup(s => s.addTerem(request))
                .ReturnsAsync(new ErrorModel("A sorok és oszlopok száma pozitív egész szám kell legyen"));

            
            var result = await _controller.AddTerem(request);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("A sorok és oszlopok száma pozitív egész szám kell legyen", errorModel.errorMessage);
        }

        [Fact]
        public async Task AddTerem_WhenNotAdmin_ReturnsForbidden()
        {
            
            SetupRegularUser();
            var request = new ManageTeremDto { nev = "Új Terem", sorokSzama = 12, oszlopokSzama = 18 };

             & Assert
        }

        #endregion

        #region EditTerem Tests

        [Fact]
        public async Task EditTerem_WhenAdmin_AndSuccessful_ReturnsOkWithSuccessMessage()
        {
            
            SetupAdminUser();
            var request = new ManageTeremDto { id = 1, nev = "Módosított Terem", sorokSzama = 12, oszlopokSzama = 18 };
            
            _mockTeremService.Setup(s => s.editTerem(request))
                .ReturnsAsync(new ErrorModel("Sikeres módosítás"));

            
            var result = await _controller.EditTerem(request);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(okResult.Value);
            Assert.Equal("Sikeres módosítás", errorModel.errorMessage);
        }

        [Fact]
        public async Task EditTerem_WhenAdmin_AndFailed_ReturnsBadRequestWithErrorMessage()
        {
            
            SetupAdminUser();
            var request = new ManageTeremDto { id = 999, nev = "Módosított Terem", sorokSzama = 12, oszlopokSzama = 18 }; // Non-existent ID
            
            _mockTeremService.Setup(s => s.editTerem(request))
                .ReturnsAsync(new ErrorModel("A terem nem található"));

            
            var result = await _controller.EditTerem(request);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("A terem nem található", errorModel.errorMessage);
        }

        [Fact]
        public async Task EditTerem_WhenAdmin_AndTeremHasVetitesek_ReturnsBadRequestWithErrorMessage()
        {
            
            SetupAdminUser();
            var request = new ManageTeremDto { id = 2, nev = "Módosított Terem", sorokSzama = 5, oszlopokSzama = 10 }; // Terem with vetítések
            
            _mockTeremService.Setup(s => s.editTerem(request))
                .ReturnsAsync(new ErrorModel("A terem mérete nem módosítható, mert vannak hozzá kapcsolódó vetítések"));

            
            var result = await _controller.EditTerem(request);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("A terem mérete nem módosítható, mert vannak hozzá kapcsolódó vetítések", errorModel.errorMessage);
        }

        [Fact]
        public async Task EditTerem_WhenNotAdmin_ReturnsForbidden()
        {
            
            SetupRegularUser();
            var request = new ManageTeremDto { id = 1, nev = "Módosított Terem", sorokSzama = 12, oszlopokSzama = 18 };

             & Assert
        }

        #endregion

        #region DeleteTerem Tests

        [Fact]
        public async Task DeleteTerem_WhenAdmin_AndSuccessful_ReturnsOkWithSuccessMessage()
        {
            
            SetupAdminUser();
            var teremId = 1;
            
            _mockTeremService.Setup(s => s.deleteTerem(teremId))
                .ReturnsAsync(new ErrorModel("Sikeres törlés"));

            
            var result = await _controller.deleteTerem(teremId);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(okResult.Value);
            Assert.Equal("Sikeres törlés", errorModel.errorMessage);
        }

        [Fact]
        public async Task DeleteTerem_WhenAdmin_AndFailed_ReturnsBadRequestWithErrorMessage()
        {
            
            SetupAdminUser();
            var teremId = 999;
            
            _mockTeremService.Setup(s => s.deleteTerem(teremId))
                .ReturnsAsync(new ErrorModel("A terem nem található"));

            
            var result = await _controller.deleteTerem(teremId);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("A terem nem található", errorModel.errorMessage);
        }

        [Fact]
        public async Task DeleteTerem_WhenAdmin_AndTeremHasVetitesek_ReturnsBadRequestWithErrorMessage()
        {
            
            SetupAdminUser();
            var teremId = 2; 
            
            _mockTeremService.Setup(s => s.deleteTerem(teremId))
                .ReturnsAsync(new ErrorModel("A terem nem törölhető, mert vannak hozzá kapcsolódó vetítések"));

            
            var result = await _controller.deleteTerem(teremId);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
