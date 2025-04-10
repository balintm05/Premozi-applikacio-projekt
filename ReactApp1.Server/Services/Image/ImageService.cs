using ReactApp1.Server.Data;
using ReactApp1.Server.Entities;
using Microsoft.EntityFrameworkCore;


namespace ReactApp1.Server.Services.Image
{
    public class ImageService(DataBaseContext context, IWebHostEnvironment env, IConfiguration config) :IImageService
    {
        private readonly string _imagesDir = Path.Combine(env.ContentRootPath, config["FileStorage:ImageStoragePath"] ?? "Images");

        public async Task<List<Images>?> getImages()
        {
            await SyncFolderWithDatabase();
            return await context.Images.AsNoTracking().ToListAsync();
        }

        private async Task SyncFolderWithDatabase()
        {
            try
            {
                Directory.CreateDirectory(_imagesDir);
                var files = Directory.GetFiles(_imagesDir)
                    .Where(f => f.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) ||
                               f.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase) ||
                               f.EndsWith(".png", StringComparison.OrdinalIgnoreCase))
                    .ToList();
                var dbFileNames = await context.Images
                    .Select(i => i.FileName)
                    .ToListAsync();
                var newFiles = files
                    .Where(filePath => !dbFileNames.Contains(Path.GetFileName(filePath)))
                    .ToList();
                foreach (var filePath in newFiles)
                {
                    var fileInfo = new FileInfo(filePath);
                    var fileName = Path.GetFileName(filePath);
                    var image = new Images
                    {
                        FileName = fileName,
                        OriginalFileName = fileName,
                        RelativePath = $"/images/{fileName}",
                        ContentType = fileName.EndsWith(".png", StringComparison.OrdinalIgnoreCase)
                            ? "image/png"
                            : "image/jpeg",
                        FileSize = fileInfo.Length,
                        UploadDate = fileInfo.CreationTimeUtc
                    };
                    await context.Images.AddAsync(image);
                }
                if (newFiles.Count > 0)
                {
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba történt a kép mappa szinkronizálása közben: {ex.Message}");
            }
        }
    }
}
