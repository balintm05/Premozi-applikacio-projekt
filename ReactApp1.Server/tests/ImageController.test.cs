using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Moq;
using ReactApp1.Server.Controllers;
using ReactApp1.Server.Entities;
using ReactApp1.Server.Models;
using ReactApp1.Server.Services.Image;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Xunit;

namespace ReactApp1.Server.Tests.Controllers
{
    public class ImageControllerTests
    {
        private readonly Mock<IWebHostEnvironment> _mockEnvironment;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly Mock<IImageService> _mockImageService;
        private readonly ImageController _controller;

        public ImageControllerTests()
        {
            _mockEnvironment = new Mock<IWebHostEnvironment>();
            _mockConfiguration = new Mock<IConfiguration>();
            _mockImageService = new Mock<IImageService>();

            // Javított konfiguráció mockolása
            var configSection = new Mock<IConfigurationSection>();
            configSection.Setup(x => x["MaxFileSize"]).Returns("20971520"); // 20MB
            configSection.Setup(x => x["AllowedExtensions"]).Returns(".jpg,.jpeg,.png");
            configSection.Setup(x => x["ImageStoragePath"]).Returns("Images");

            _mockConfiguration.Setup(x => x.GetSection("FileStorage")).Returns(configSection.Object);
            _mockEnvironment.Setup(x => x.ContentRootPath).Returns(Directory.GetCurrentDirectory());

            _controller = new ImageController(
                _mockEnvironment.Object,
                _mockConfiguration.Object,
                _mockImageService.Object);
        }

        [Fact]
        public async Task GetImages_AdminRole_ReturnsListOfImages()
        {
            // Arrange
            var expectedImages = new List<Images>
            {
                new Images { Id = 1, FileName = "test1.jpg" },
                new Images { Id = 2, FileName = "test2.jpg" }
            };
            _mockImageService.Setup(x => x.getImages()).ReturnsAsync(expectedImages);

            // Act
            var result = await _controller.GetImages();

            // Assert
            Assert.Equal(expectedImages, result);
        }

        [Fact]
        public async Task UploadImage_ValidFile_ReturnsOkWithResponse()
        {
            // Arrange
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(f => f.FileName).Returns("test.jpg");
            fileMock.Setup(f => f.Length).Returns(1024);
            fileMock.Setup(f => f.ContentType).Returns("image/jpeg");
            fileMock.Setup(f => f.CopyToAsync(It.IsAny<Stream>(), default))
                .Returns(Task.CompletedTask);

            // Mockoljuk a képfeltöltés eredményét
            var successResponse = new ErrorModel("Sikeres hozzáadás");
            _mockImageService.Setup(x => x.addImage(It.IsAny<IFormFile>(), It.IsAny<HttpContext>()))
                .ReturnsAsync(successResponse);

            // Act
            var result = await _controller.UploadImage(fileMock.Object, null);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<ErrorModel>(okResult.Value);
            Assert.Equal("Sikeres hozzáadás", response.errorMessage);
        }

        [Fact]
        public async Task UploadImage_NoFile_ReturnsBadRequest()
        {
            // Act
            var result = await _controller.UploadImage(null, null);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var response = Assert.IsType<ImageUploadResponse>(badRequestResult.Value);
            Assert.Equal("No file provided", response.Error.errorMessage);
        }

        [Fact]
        public async Task UploadImage_FileTooLarge_ReturnsBadRequest()
        {
            // Arrange
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(f => f.Length).Returns(21 * 1024 * 1024); // 21MB
            fileMock.Setup(f => f.FileName).Returns("test.jpg");

            // Act
            var result = await _controller.UploadImage(fileMock.Object, null);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var response = Assert.IsType<ImageUploadResponse>(badRequestResult.Value);
            Assert.Contains("Max size: 20MB", response.Error.errorMessage);
        }

        [Fact]
        public async Task DeleteImage_ExistingId_ReturnsNoContent()
        {
            // Arrange
            var successResponse = new ErrorModel("Sikeres törlés");
            _mockImageService.Setup(x => x.deleteImage(1))
                .ReturnsAsync(successResponse);

            // Act
            var result = await _controller.DeleteImage(1, null);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteImage_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            var errorResponse = new ErrorModel("Nem található kép");
            _mockImageService.Setup(x => x.deleteImage(1))
                .ReturnsAsync(errorResponse);

            // Act
            var result = await _controller.DeleteImage(1, null);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}