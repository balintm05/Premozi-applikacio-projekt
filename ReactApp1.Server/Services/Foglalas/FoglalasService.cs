using ReactApp1.Server.Data;
using ReactApp1.Server.Entities.Foglalas;
using ReactApp1.Server.Services.Vetites;
using Microsoft.EntityFrameworkCore;

namespace ReactApp1.Server.Services.Foglalas
{
    public class FoglalasService(DataBaseContext context, IConfiguration configuration) : IFoglalasService
    {
        public async Task<List<FoglalasAdatok>?> GetFoglalas()
        {
            var adatok =  await context.FoglalasAdatok.ToListAsync();
            var users = await context.Users.ToListAsync();
            var fszekek = await context.FoglaltSzekek.ToListAsync();
            var vetites = await context.Vetites.ToListAsync();
            return adatok;
        }
        public async Task<List<FoglalasAdatok>?> GetFoglalasByVetites(int vid)
        {
            var adatok = await context.FoglalasAdatok.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.id == vid)).ToListAsync();
            if (adatok.Count == 0)
            {
                return null;
            }
            var users = await context.Users.ToListAsync();
            var fszekek = await context.FoglaltSzekek.ToListAsync();
            var vetites = await context.Vetites.ToListAsync();
            return adatok;
        }
        public async Task<List<FoglalasAdatok>?> GetFoglalasByUser(int uid)
        {
            var adatok = await context.FoglalasAdatok.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.id == uid)).ToListAsync();
            if (adatok.Count==0)
            {
                return null;
            }
            var users = await context.Users.ToListAsync();
            var fszekek = await context.FoglaltSzekek.ToListAsync();
            var vetites = await context.Vetites.ToListAsync();
            return adatok;
        }
    }
}
