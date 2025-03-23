using ReactApp1.Server.Entities.Foglalas;

namespace ReactApp1.Server.Services.Foglalas
{
    public interface IFoglalasService
    {
        Task<List<FoglalasAdatok>?> GetFoglalas();
        Task<List<FoglalasAdatok>?> GetFoglalasByVetites(int vid);
        Task<List<FoglalasAdatok>?> GetFoglalasByUser(int uid);
    }
}
