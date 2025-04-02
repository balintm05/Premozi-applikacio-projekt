using ReactApp1.Server.Entities;

namespace ReactApp1.Server.Services.Image
{
    public interface IImageService
    {
        Task<List<Images>?> getImages();
    }
}
