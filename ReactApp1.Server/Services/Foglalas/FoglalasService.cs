using ReactApp1.Server.Data;
using ReactApp1.Server.Entities.Foglalas;
using ReactApp1.Server.Services.Vetites;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models.Rendeles;
using ReactApp1.Server.Models.Foglalas;
using ReactApp1.Server.Entities.Vetites;

namespace ReactApp1.Server.Services.Foglalas
{
    public class FoglalasService(DataBaseContext context, IConfiguration configuration) : IFoglalasService
    {
        public async Task<List<GetFoglalasResponse>?> GetFoglalas()
        {
            var foglalasok =  await context.FoglalasAdatok.ToListAsync();
            var users = await context.Users.ToListAsync();
            var fszekek = await context.FoglaltSzekek.ToListAsync();
            var vetites = await context.Vetites.ToListAsync();
            var resp = new List<GetFoglalasResponse>();
            foreach (var foglalas in foglalasok)
            {
                resp.Add(new GetFoglalasResponse(foglalas));
            }
            return resp;
        }
        public async Task<List<GetFoglalasResponse>?> GetFoglalasByVetites(int vid)
        {
            var foglalasok = await context.FoglalasAdatok.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.id == vid)).ToListAsync();
            if (foglalasok.Count == 0)
            {
                return null;
            }
            var users = await context.Users.ToListAsync();
            var fszekek = await context.FoglaltSzekek.ToListAsync();
            var vetites = await context.Vetites.ToListAsync();
            var resp = new List<GetFoglalasResponse>();
            foreach(var foglalas in foglalasok)
            {
                resp.Add(new GetFoglalasResponse(foglalas));
            }
            return resp;
        }
        public async Task<List<GetFoglalasResponse>?> GetFoglalasByUser(int uid)
        {
            var foglalasok = await context.FoglalasAdatok.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.id == uid)).ToListAsync();
            if (foglalasok.Count==0)
            {
                return null;
            }
            var users = await context.Users.ToListAsync();
            var fszekek = await context.FoglaltSzekek.ToListAsync();
            var vetites = await context.Vetites.ToListAsync();
            var resp = new List<GetFoglalasResponse>();
            foreach (var foglalas in foglalasok)
            {
                resp.Add(new GetFoglalasResponse(foglalas));
            }
            return resp;
        }
        public async Task<Models.ErrorModel?> addFoglalas(ManageFoglalasDto request)
        {
            var foglalas = new FoglalasAdatok();            
            var uidb = int.TryParse(request.UserID, out int uid);
            var vidb = int.TryParse(request.VetitesID, out int vid);            
            if (!uidb)
            {
                return new Models.ErrorModel("A felhasználó id-nek számnak kell lennie");
            }
            if (!vidb)
            {
                return new Models.ErrorModel("A vetítés id-nek számnak kell lennie");
            }
            var user = await context.Users.FindAsync(uid);
            var vetites = await context.Vetites.FindAsync(vid);
            if(user == null)
            {
                return new Models.ErrorModel("Nem található ezzel az id-vel felhasználó az adatbázisban");
            }
            if (vetites == null)
            {
                return new Models.ErrorModel("Nem található ezzel az id-vel vetítés az adatbázisban");
            }
            foglalas.UserID = uid;
            await context.AddAsync(foglalas);
            var vetitesszekek = await context.VetitesSzekek.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.Vetitesid == vid && request.X.Contains(x.X.ToString()) && request.X.Contains(x.Y.ToString()) )).ToListAsync();
            var foglaltszekek = new List<FoglaltSzekek>();    
            foreach(var h in vetitesszekek)
            {
                foglaltszekek.Add(new FoglaltSzekek { FoglalasAdatok = foglalas, VetitesSzekek = h});
            }
            await context.AddRangeAsync(foglaltszekek);
            await context.SaveChangesAsync();
            return new Models.ErrorModel("");
        }
    }
}
