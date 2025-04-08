using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Entities.Foglalas;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models.Foglalas;
using ReactApp1.Server.Services.Foglalas;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

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
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = _httpContext
            };
        }

        #region GetJegyTipus Tests

        [Fact]
        public async Task GetJegyTipus_ReturnsAllJegyTipusok()
        {
            
            var jegyTipusok = new List<JegyTipus>
            {
                new JegyTipus { id = 1, nev = "Felnőtt", ar = 2000 },
                new JegyTipus { id = 2, nev = "Diák", ar = 1500 }
            };
            
            _mockFoglalasService.Setup(s => s.getJegyTipusok())
                .ReturnsAsync(jegyTipusok);

            
            var result = await _controller.GetJegyTipus();

            
            var actionResult = Assert.IsType<ActionResult<List<JegyTipus>>>(result);
            var returnValue = Assert.IsType<List<JegyTipus>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count);
            Assert.Equal("Felnőtt", returnValue[0].nev);
            Assert.Equal("Diák", returnValue[1].nev);
            Assert.Equal(2000, returnValue[0].ar);
            Assert.Equal(1500, returnValue[1].ar);
        }

        [Fact]
        public async Task GetJegyTipus_WhenServiceReturnsEmptyList_ReturnsEmptyList()
        {
            
            _mockFoglalasService.Setup(s => s.getJegyTipusok())
                .ReturnsAsync(new List<JegyTipus>());

            
            var result = await _controller.GetJegyTipus();

            
            var actionResult = Assert.IsType<ActionResult<List<JegyTipus>>>(result);
            var returnValue = Assert.IsType<List<JegyTipus>>(actionResult.Value);
            Assert.Empty(returnValue);
        }

        #endregion

        #region GetFoglalas Tests

        [Fact]
        public async Task GetFoglalas_WhenAdmin_ReturnsAllFoglalasok()
        {
            
            SetupAdminUser();
            var foglalasok = new List<GetFoglalasResponse>
            {
                new GetFoglalasResponse { id = 1, userId = 1, vetitesId = 1 },
                new GetFoglalasResponse { id = 2, userId = 2, vetitesId = 1 }
            };
            
            _mockFoglalasService.Setup(s => s.GetFoglalas())
                .ReturnsAsync(foglalasok);

            
            var result = await _controller.GetFoglalas();

            
            var actionResult = Assert.IsType<ActionResult<List<GetFoglalasResponse>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnValue = Assert.IsType<List<GetFoglalasResponse>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
            Assert.Equal(1, returnValue[0].id);
            Assert.Equal(2, returnValue[1].id);
        }

        [Fact]
        public async Task GetFoglalas_WhenAdmin_AndServiceReturnsEmptyList_ReturnsEmptyList()
        {
            
            SetupAdminUser();
            _mockFoglalasService.Setup(s => s.GetFoglalas())
                .ReturnsAsync(new List<GetFoglalasResponse>());

            
            var result = await _controller.GetFoglalas();

            
            var actionResult = Assert.IsType<ActionResult<List<GetFoglalasResponse>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnValue = Assert.IsType<List<GetFoglalasResponse>>(okResult.Value);
            Assert.Empty(returnValue);
        }

        [Fact]
        public async Task GetFoglalas_WhenNotAdmin_ReturnsForbidden()
        {
            
            SetupRegularUser();

             & Assert

        }

        #endregion

        #region GetFoglalasByVetites Tests

        [Fact]
        public async Task GetFoglalasByVetites_WithValidId_ReturnsFoglalasok()
        {
            
            SetupAuthenticatedUser();
            var vetitesId = 1;
            var foglalasok = new List<GetFoglalasResponse>
            {
                new GetFoglalasResponse { id = 1, userId = 1, vetitesId = vetitesId },
                new GetFoglalasResponse { id = 2, userId = 2, vetitesId = vetitesId }
            };
            
            _mockFoglalasService.Setup(s => s.GetFoglalasByVetites(vetitesId))
                .ReturnsAsync(foglalasok);

            
            var result = await _controller.GetFoglalasByVetites(vetitesId);

            
            var actionResult = Assert.IsType<ActionResult<List<GetFoglalasResponse>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnValue = Assert.IsType<List<GetFoglalasResponse>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
            Assert.All(returnValue, item => Assert.Equal(vetitesId, item.vetitesId));
        }

        [Fact]
        public async Task GetFoglalasByVetites_WithInvalidId_ReturnsBadRequest()
        {
            
            SetupAuthenticatedUser();
            var vetitesId = 999;
            
            _mockFoglalasService.Setup(s => s.GetFoglalasByVetites(vetitesId))
                .ReturnsAsync((List<GetFoglalasResponse>)null);

            
            var result = await _controller.GetFoglalasByVetites(vetitesId);

            
            var actionResult = Assert.IsType<ActionResult<List<GetFoglalasResponse>>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            Assert.Equal("Nem található foglalás ezzel a vetítés id-vel", badRequestResult.Value);
        }

        [Fact]
        public async Task GetFoglalasByVetites_WhenNotAuthenticated_ReturnsForbidden()
        {
            
            var vetitesId = 1;

             & Assert
        }

        #endregion

        #region GetFoglalasByUser Tests

        [Fact]
        public async Task GetFoglalasByUser_WithValidId_ReturnsFoglalasok()
        {
            
            SetupAuthenticatedUser();
            var userId = 1;
            var foglalasok = new List<GetFoglalasResponse>
            {
                new GetFoglalasResponse { id = 1, userId = userId, vetitesId = 1 },
                new GetFoglalasResponse { id = 2, userId = userId, vetitesId = 2 }
            };
            
            _mockFoglalasService.Setup(s => s.GetFoglalasByUser(userId))
                .ReturnsAsync(foglalasok);

            
            var result = await _controller.GetFoglalasByUser(userId);

            
            var actionResult = Assert.IsType<ActionResult<List<GetFoglalasResponse>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnValue = Assert.IsType<List<GetFoglalasResponse>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
            Assert.All(returnValue, item => Assert.Equal(userId, item.userId));
        }

        [Fact]
        public async Task GetFoglalasByUser_WithInvalidId_ReturnsBadRequest()
        {
            
            SetupAuthenticatedUser();
            var userId = 999;
            
            _mockFoglalasService.Setup(s => s.GetFoglalasByUser(userId))
                .ReturnsAsync((List<GetFoglalasResponse>)null);

            
            var result = await _controller.GetFoglalasByUser(userId);

            
            var actionResult = Assert.IsType<ActionResult<List<GetFoglalasResponse>>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            Assert.Equal("Nem található foglalás ezzel a felhasználó id-vel", badRequestResult.Value);
        }

        [Fact]
        public async Task GetFoglalasByUser_WhenNotAuthenticated_ReturnsForbidden()
        {
            
            var userId = 1;

             & Assert

        }

        #endregion

        #region AddFoglalas Tests

        [Fact]
        public async Task AddFoglalas_WhenAuthenticated_AndSuccessful_ReturnsOkWithSuccessMessage()
        {
            
            SetupAuthenticatedUser();
            var request = new ManageFoglalasDto 
            { 
                vetitesId = 1, 
                userId = 1,
                jegyek = new List<JegyDto> 
                { 
                    new JegyDto { jegyTipusId = 1, sorSzam = 1, oszlopSzam = 1 } 
                }
            };
            
            _mockFoglalasService.Setup(s => s.addFoglalas(request))
                .ReturnsAsync(new ErrorModel("Sikeres hozzáadás"));

            
            var result = await _controller.AddFoglalas(request);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(okResult.Value);
            Assert.Equal("Sikeres hozzáadás", errorModel.errorMessage);
        }

        [Fact]
        public async Task AddFoglalas_WhenAuthenticated_AndFailed_ReturnsBadRequestWithErrorMessage()
        {
            
            SetupAuthenticatedUser();
            var request = new ManageFoglalasDto 
            { 
                vetitesId = 999, 
                userId = 1,
                jegyek = new List<JegyDto> 
                { 
                    new JegyDto { jegyTipusId = 1, sorSzam = 1, oszlopSzam = 1 } 
                }
            };
            
            _mockFoglalasService.Setup(s => s.addFoglalas(request))
                .ReturnsAsync(new ErrorModel("A vetítés nem található"));

            
            var result = await _controller.AddFoglalas(request);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("A vetítés nem található", errorModel.errorMessage);
        }

        [Fact]
        public async Task AddFoglalas_WhenAuthenticated_AndSeatsAlreadyBooked_ReturnsBadRequestWithErrorMessage()
        {
            
            SetupAuthenticatedUser();
            var request = new ManageFoglalasDto 
            { 
                vetitesId = 1,
                userId = 1,
                jegyek = new List<JegyDto> 
                { 
                    new JegyDto { jegyTipusId = 1, sorSzam = 1, oszlopSzam = 1 } 
                }
            };
            
            _mockFoglalasService.Setup(s => s.addFoglalas(request))
                .ReturnsAsync(new ErrorModel("A kiválasztott helyek már foglaltak"));

            
            var result = await _controller.AddFoglalas(request);

            
            var actionResult = Assert.IsType<ActionResult<ErrorModel>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var errorModel = Assert.IsType<ErrorModel>(badRequestResult.Value);
            Assert.Equal("A kiválasztott helyek már foglaltak", errorModel.errorMessage);
        }

        [Fact]
        public async Task AddFoglalas_WhenNotAuthenticated_ReturnsForbidden()
        {
            
            var request = new ManageFoglalasDto();

             & Assert

