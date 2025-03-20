using ReactApp1.Server.Models;
using ReactApp1.Server.Models.Terem;
using ReactApp1.Server.Models.Vetites;

namespace ReactApp1.Server.Services.Vetites
{
    public interface IVetitesService
    {
        Task<List<GetVetitesResponse>?> getVetites();
        Task<GetVetitesResponse?> getVetites(int id);
        Task<ErrorModel?> addVetites(ManageVetitesDto request);
        Task<ErrorModel?> editVetites(ManageVetitesDto request);
        Task<ErrorModel> deleteVetites(int id);
    }
}
