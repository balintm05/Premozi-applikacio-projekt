using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Moq;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Data;
using ReactApp1.Server.Entities;
using ReactApp1.Server.Models;
using ReactApp1.Server.Services.Image;
using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace ReactApp1.Server.Tests.Controllers
{
    public class ImageControllerTests
    {
        private readonly Mock<IWebHostEnvironment> _mockEnvironment;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly Mock<IImageService> _mockImageService;
        private readonly Mock<DataBaseContext> _mockDbContext;
        private readonly ImageController _controller;
        private readonly DefaultHttpContext _httpContext;
        private readonly Mock<IConfigurationSection> _mockFileStorageSection;

        public ImageControllerTests()
        {
            _mockEnvironment = new Mock<IWebHostEnvironment>();
            _mockConfiguration = new Mock<IConfiguration>();
            _mockImageService = new Mock<IImageService>();
            _mockDbContext = new Mock<DataBaseContext>();
            
            _mockFileStorageSection = new Mock<IConfigurationSection>();
            _mockConfiguration.Setup(c => c.GetSection("FileStorage")).Returns(_mockFileStorageSection.Object);
            
            _controller = new ImageController(
                _mockEnvironment.Object,
                _mockConfiguration.Object,
                _mockImageService.Object);
            
            _httpContext = new DefaultHttpContext();
            _httpContext.Request.Scheme = "https";
            _httpContext.Request.Host = new HostString("localhost:7153");
            
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = _httpContext
            };
            
            _mockEnvironment.Setup(e => e.ContentRootPath).Returns("C:\\TestPath");
        }

        #region GetImages Tests

        [Fact]
        public async Task GetImages_WhenAdmin_ReturnsAllImages()
        {
            
            SetupAdminUser();
            var images = new List<Images>
            {
                new Images { Id = 1, FileName = "image1.jpg", RelativePath = "/images/image1.jpg" },
                new Images { Id = 2, FileName = "image2.jpg", RelativePath = "/images/image2.jpg" }
            };
            
            _mockImageService.Setup(s => s.getImages())
                .ReturnsAsync(images);

            
            var result = await _controller.GetImages();

            
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal("image1.jpg", result[0].FileName);
            Assert.Equal("image2.jpg", result[1].FileName);
        }

        [Fact]
        public async Task GetImages_WhenAdmin_AndNoImages_ReturnsEmptyList()
        {
            
            SetupAdminUser();
            _mockImageService.Setup(s => s.getImages())
                .ReturnsAsync(new List<Images>());

            
            var result = await _controller.GetImages();

            
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetImages_WhenNotAdmin_ReturnsForbidden()
        {
            
            SetupRegularUser();

             & Assert
        }

        #endregion

        #region UploadImage Tests

        [Fact]
        public async Task UploadImage_WithValidImage_ReturnsSuccessResponse()
        {
            
            SetupInternalUser();
            var file = CreateMockFile("test.jpg", "image/jpeg", 1024);
            
            _mockFileStorageSection.Setup(s => s.GetValue<long>("MaxFileSize", It.IsAny<long>()))
                .Returns(20 * 1024 * 1024);
            _mockFileStorageSection.Setup(s => s.GetValue<string[]>("AllowedExtensions", It.IsAny<string[]>()))
                .Returns(new[] { ".jpg", ".jpeg", ".png" });
            _mockFileStorageSection.Setup(s => s["ImageStoragePath"])
                .Returns("Images");
            
            var directoryPath = Path.Combine(_mockEnvironment.Object.ContentRootPath, "Images");
            
            Images capturedImage = null;
            _mockDbContext.Setup(db => db.Images.AddAsync(It.IsAny<Images>(), It.IsAny<CancellationToken>()))
                .Callback<Images, CancellationToken>((image, token) => capturedImage = image)
                .Returns(new ValueTask<Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry<Images>>());
            
            _mockDbContext.Setup(db => db.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            
            var result = await _controller.UploadImage(file, _mockDbContext.Object);

            
            var actionResult = Assert.IsType<ActionResult<ImageUploadResponse>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var response = Assert.IsType<ImageUploadResponse>(okResult.Value);
            
            Assert.NotNull(response);
            Assert.Null(response.Error);
            Assert.NotNull(response.Url);
            Assert.True(response.Url.StartsWith("https://localhost:7153/images/"));
        }

        [Fact]
        public async Task UploadImage_WithNoFile_ReturnsBadRequest()
        {
            
            SetupInternalUser();
            IFormFile file = null;
            
            
            var result = await _controller.UploadImage(file, _mockDbContext.Object);

            
            var actionResult = Assert.IsType<ActionResult<ImageUploadResponse>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var response = Assert.IsType<ImageUploadResponse>(badRequestResult.Value);
            
            Assert.NotNull(response);
            Assert.NotNull(response.Error);
            Assert.Equal("No file provided", response.Error.errorMessage);
        }

        [Fact]
        public async Task UploadImage_WithEmptyFile_ReturnsBadRequest()
        {
            
            SetupInternalUser();
            var file = CreateMockFile("test.jpg", "image/jpeg", 0);
            
            
            var result = await _controller.UploadImage(file, _mockDbContext.Object);

            
            var actionResult = Assert.IsType<ActionResult<ImageUploadResponse>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var response = Assert.IsType<ImageUploadResponse>(badRequestResult.Value);
            
            Assert.NotNull(response);
            Assert.NotNull(response.Error);
            Assert.Equal("No file provided", response.Error.errorMessage);
        }

        [Fact]
        public async Task UploadImage_WithFileTooLarge_ReturnsBadRequest()
        {
            
            SetupInternalUser();
            var maxSize = 10 * 1024 * 1024;
            var file = CreateMockFile("test.jpg", "image/jpeg", maxSize + 1024);
            
            _mockFileStorageSection.Setup(s => s.GetValue<long>("MaxFileSize", It.IsAny<long>()))
                .Returns(maxSize);
            
            
            var result = await _controller.UploadImage(file, _mockDbContext.Object);

            
            var actionResult = Assert.IsType<ActionResult<ImageUploadResponse>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var response = Assert.IsType<ImageUploadResponse>(badRequestResult.Value);
            
            Assert.NotNull(response);
            Assert.NotNull(response.Error);
            Assert.Equal($"Max size: {maxSize / 1024 / 1024}MB", response.Error.errorMessage);
        }

        [Fact]
        public async Task UploadImage_WithInvalidFileExtension_ReturnsBadRequest()
        {
            
            SetupInternalUser();
            var file = CreateMockFile("test.txt", "text/plain", 1024);
            
            _mockFileStorageSection.Setup(s => s.GetValue<long>("MaxFileSize", It.IsAny<long>()))
                .Returns(20 * 1024 * 1024);
            _mockFileStorageSection.Setup(s => s.GetValue<string[]>("AllowedExtensions", It.IsAny<string[]>()))
                .Returns(new[] { ".jpg", ".jpeg", ".png" });
            
            
            var result = await _controller.UploadImage(file, _mockDbContext.Object);

            
            var actionResult = Assert.IsType<ActionResult<ImageUploadResponse>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            var response = Assert.IsType<ImageUploadResponse>(badRequestResult.Value);
            
            Assert.NotNull(response);
            Assert.NotNull(response.Error);
            Assert.Equal("Allowed formats: .jpg, .jpeg, .png", response.Error.errorMessage);
        }

        [Fact]
        public async Task UploadImage_WhenNotAuthorized_ReturnsForbidden()
        {
            
            SetupRegularUser();
            var file = CreateMockFile("test.jpg", "image/jpeg", 1024);

             & Assert
        }

        #endregion

        #region DeleteImage Tests

        [Fact]
        public async Task DeleteImage_WithValidId_ReturnsNoContent()
        {
            
            SetupAdminUser();
            var imageId = 1;
            var image = new Images { Id = imageId, FileName = "image1.jpg" };
            
            _mockDbContext.Setup(db => db.Images.FindAsync(imageId))
                .ReturnsAsync(image);
            
            _mockFileStorageSection.Setup(s => s["ImageStoragePath"])
                .Returns("Images");
            
            var filePath = Path.Combine(_mockEnvironment.Object.ContentRootPath, "Images", image.FileName);
            
            var fileInfo = new FileInfo(filePath);
            
            
            var result = await _controller.DeleteImage(imageId, _mockDbContext.Object);

            
            var noContentResult = Assert.IsType<NoContentResult>(result);
            Assert.Equal(StatusCodes.Status204NoContent, noContentResult.StatusCode);
            
            _mockDbContext.Verify(db => db.Images.Remove(image), Times.Once);
            _mockDbContext.Verify(db => db.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task DeleteImage_WithInvalidId_ReturnsNotFound()
        {
            
            SetupAdminUser();
            var imageId = 999;
            
            _mockDbContext.Setup(db => db.Images.FindAsync(imageId))
                .ReturnsAsync((Images)null);
            
            
            var result = await _controller.DeleteImage(imageId, _mockDbContext.Object);

            
            Assert.IsType<NotFoundResult>(result);
            
            _mockDbContext.Verify(db => db.Images.Remove(It.IsAny<Images>()), Times.Never);
            _mockDbContext.Verify(db => db.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
        }

        [Fact]
        public async Task DeleteImage_WhenNotAdmin_ReturnsForbidden()
        {
            
            SetupRegularUser();
            var imageId = 1;

             & Assert
        }

        #endregion

        #region Helper Methods

        private void SetupAdminUser()
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "1"),
                new Claim(ClaimTypes.Role, "Admin")
            };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var principal = new ClaimsPrincipal(identity);
            
            _httpContext.User = principal;
        }

        private void SetupRegularUser()
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "2"),
                new Claim(ClaimTypes.Role, "User")
            };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var principal = new ClaimsPrincipal(identity);
            
            _httpContext.User = principal;
        }

        private void SetupInternalUser()
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "3"),
                new Claim("InternalUser", "true")
            };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var principal = new ClaimsPrincipal(identity);
            
            _httpContext.User = principal;
        }

        private IFormFile CreateMockFile(string fileName, string contentType, long length)
        {
            var fileMock = new Mock<IFormFile>();
            var ms = new MemoryStream();
            
            fileMock.Setup(f => f.FileName).Returns(fileName);
            fileMock.Setup(f => f.Length).Returns(length);
