using ReactApp1.Server.Models;
using ReactApp1.Server.Models.Terem;
namespace ReactApp1.Server.Services
{
    public interface ITeremService
    {
        Task<List<GetTeremResponse>?> getTerem();
        Task<Models.ErrorModel?> addTerem(ManageTeremDto request);
        Task<Models.ErrorModel?> editTerem(ManageTeremDto request);
        Task<Models.ErrorModel?> deleteTerem(int id);
    }
}
