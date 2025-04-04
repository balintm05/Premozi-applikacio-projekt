using ReactApp1.Server.Entities.Foglalas;
using ReactApp1.Server.Models.Foglalas;
using ReactApp1.Server.Models.Rendeles;

namespace ReactApp1.Server.Services.Foglalas
{
    public interface IFoglalasService
    {
        Task<List<JegyTipus>> getJegyTipusok();
        Task<List<GetFoglalasResponse>?> GetFoglalas();
        Task<List<GetFoglalasResponse>?> GetFoglalasByVetites(int vid);
        Task<List<GetFoglalasResponse>?> GetFoglalasByUser(int uid);
        Task<Models.ErrorModel?> addFoglalas(ManageFoglalasDto request);
        Task<Models.ErrorModel?> editFoglalas(ManageFoglalasDto request);
        Task<Models.ErrorModel?> deleteFoglalas(int id);
    }
}
