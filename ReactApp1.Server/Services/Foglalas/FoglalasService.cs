using ReactApp1.Server.Data;
using ReactApp1.Server.Entities.Foglalas;
using ReactApp1.Server.Services.Vetites;
using System.Data.Entity;

namespace ReactApp1.Server.Services.Foglalas
{
    public class FoglalasService(DataBaseContext context, IConfiguration configuration) : IFoglalasService
    {
        public async Task<List<FoglalasAdatok>?> GetFoglalas()
        {
            return await context.FoglalasAdatok.ToListAsync();
        }
    }
}
