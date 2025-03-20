using ReactApp1.Server.Entities.Foglalas;

namespace ReactApp1.Server.Services.Foglalas
{
    public interface IFoglalasService
    {
        Task<List<FoglalasAdatok>?> GetFoglalas();
    }
}
