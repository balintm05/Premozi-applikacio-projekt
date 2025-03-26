using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Data;
using ReactApp1.Server.Entities;
using ReactApp1.Server.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController(IWebHostEnvironment environment, IConfiguration configuration) : ControllerBase
    {
        //[Authorize(Roles="Admin")]
        [HttpPost("upload")]
        public async Task<ActionResult<ImageUploadResponse>> UploadImage(IFormFile file, [FromServices] DataBaseContext dbContext)
        {
            try
            {
                var config = configuration.GetSection("FileStorage");
                var maxSize = config.GetValue<long>("MaxFileSize", 20 * 1024 * 1024);
                var allowedExts = config.GetValue<string[]>("AllowedExtensions") ?? new[] { ".jpg", ".jpeg", ".png", ".gif" };
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new ImageUploadResponse { Error = new ErrorModel("Nem lett fájl megadva") });
                }           
                if (file.Length > maxSize)
                {
                    return BadRequest(new ImageUploadResponse { Error = new ErrorModel($"Maximum méret: {maxSize / 1024 / 1024}MB") });
                }     
                var fileExt = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExts.Contains(fileExt))
                {
                    return BadRequest(new ImageUploadResponse { Error = new ErrorModel($"Elfogadható fájtformátumok: {string.Join(", ", allowedExts)}") });
                }
                var imagesDir = Path.Combine(environment.ContentRootPath, "Images");
                if (!Directory.Exists(imagesDir))
                {
                    Directory.CreateDirectory(imagesDir);
                }
                var fileName = $"{Guid.NewGuid()}{fileExt}";
                var originalFilePath = Path.Combine(imagesDir, fileName);
                using (var stream = new FileStream(originalFilePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                var processedFileName = $"{Path.GetFileNameWithoutExtension(fileName)}.jpg";
                var processedRelativePath = $"/images/{processedFileName}";
                var processedFilePath = Path.Combine(imagesDir, processedFileName);

                await ProcessImage(
                    inputPath: originalFilePath,
                    outputPath: processedFilePath
                );
                System.IO.File.Delete(originalFilePath);
                var imageRecord = new Images
                {
                    FileName = processedFileName,
                    OriginalFileName = file.FileName,
                    RelativePath = processedRelativePath,
                    ContentType = "image/jpeg",
                    FileSize = new FileInfo(processedFilePath).Length,
                    UploadDate = DateTime.UtcNow
                };
                dbContext.Images.Add(imageRecord);
                await dbContext.SaveChangesAsync();
                var absoluteUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}{processedRelativePath}";
                return Ok(new ImageUploadResponse
                {
                    Id = imageRecord.Id,
                    Url = absoluteUrl,
                    OriginalSize = file.Length,
                    ProcessedSize = imageRecord.FileSize,
                    UploadDate = imageRecord.UploadDate
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ImageUploadResponse { Error = new ErrorModel($"Internal server error: {ex.Message}") });
            }
        }
        private async Task ProcessImage(string inputPath, string outputPath, int maxWidth = 1920, int quality = 80)
        {
            using (SixLabors.ImageSharp.Image image = await SixLabors.ImageSharp.Image.LoadAsync(inputPath))
            {
                image.Mutate(x => x.AutoOrient());
                if (image.Width > maxWidth)
                {
                    image.Mutate(x => x.Resize(new ResizeOptions
                    {
                        Size = new Size(maxWidth, 0),
                        Mode = ResizeMode.Max
                    }));
                }
                var encoder = new JpegEncoder()
                {
                    Quality = quality,
                    ColorType = JpegEncodingColor.YCbCrRatio420
                };
                await image.SaveAsync(outputPath, encoder);
            }
        }
    }
}
