using ReactApp1.Server.Data;
using ReactApp1.Server.Entities;
using ReactApp1.Server.Data;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models.Terem;
using ReactApp1.Server.Models.Vetites;
using ReactApp1.Server.Data;
using ReactApp1.Server.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using ReactApp1.Server.Data;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.SignalR;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Models.JWT;
using ReactApp1.Server.Models.User;
using ReactApp1.Server.Models.User.EditUser;
using NuGet.Common;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using ReactApp1.Server.Models.User.Response;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models.Film.ManageFilm;
using Humanizer;
using Org.BouncyCastle.Ocsp;
using ReactApp1.Server.Models.Film;
using ReactApp1.Server.Models.Terem;
using ReactApp1.Server.Entities.Terem;
using ReactApp1.Server.Entities.Vetites;
using ReactApp1.Server.Services.Email;


namespace ReactApp1.Server.Services.Image
{
    public class ImageService(DataBaseContext context, IWebHostEnvironment env, IConfiguration config) :IImageService
    {
        private readonly string _imagesDir = Path.Combine(env.ContentRootPath, config["FileStorage:ImageStoragePath"] ?? "Images");

        public async Task<List<Images>?> getImages()
        {
            await SyncFolderWithDatabase();
            return await context.Images.ToListAsync();
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
                Console.WriteLine($"Error syncing image folder with database: {ex.Message}");
            }
        }
    }
}
