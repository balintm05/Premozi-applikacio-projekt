using ReactApp1.Server.Data;
using ReactApp1.Server.Entities.Foglalas;
using ReactApp1.Server.Services.Vetites;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models.Rendeles;
using ReactApp1.Server.Models.Foglalas;
using ReactApp1.Server.Entities.Vetites;
using ReactApp1.Server.Models;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

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
            if(request.X.Count == 0 || request.Y.Count == 0)
            {
                return new Models.ErrorModel("Kötelező széket megadni");
            }
            if (request.X.Count != request.Y.Count)
            {
                return new Models.ErrorModel("Azonos számú koordinátát kell megadni");
            }
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

            var vetitesszekek = await context.VetitesSzekek.ToAsyncEnumerable().WhereAwait(async x =>
            {
                for(int i=0; i<request.X.Count; i++)
                {
                    if(x.Vetitesid == vid && request.X[i].Equals(x.X.ToString()) && request.Y[i].Equals(x.Y.ToString()))
                    {
                        return await ValueTask.FromResult(true);
                    }                   
                }
                return await ValueTask.FromResult(false);
            }).ToListAsync();
            if (vetitesszekek.Count != request.X.Count)
            {
                return new Models.ErrorModel("Az egyik megadott hely nem található az adatbázisban");
            }
            if(await context.VetitesSzekek.ToAsyncEnumerable().WhereAwait(async x=> await ValueTask.FromResult(x.FoglalasAllapot==0)).AnyAsync()){
                return new Models.ErrorModel("Az egyik megadott hely nem elérhető");
            }
            if (await context.VetitesSzekek.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(vetitesszekek.Contains(x) && x.FoglalasAllapot == 2)).AnyAsync())
            {
                return new Models.ErrorModel("Az egyik megadott hely már le lett foglalva");
            }
            var foglaltszekek = new List<FoglaltSzekek>();    
            foreach(var h in vetitesszekek)
            {      
                var fsz = new FoglaltSzekek { FoglalasAdatok = foglalas, VetitesSzekek = h };
                foglaltszekek.Add(fsz);
                h.FoglaltSzekek = fsz;
                h.FoglalasAllapot = 2;
            }
            context.UpdateRange(vetitesszekek);
            await context.AddRangeAsync(foglaltszekek);
            await context.SaveChangesAsync();
            return new Models.ErrorModel("Sikeres hozzáadás");
        }
        public async Task<Models.ErrorModel?> editFoglalas(ManageFoglalasDto request)
        {
            var patchDoc = new JsonPatchDocument<Entities.Foglalas.FoglalasAdatok>();
            var patchDoc2 = new JsonPatchDocument<Entities.Vetites.VetitesSzekek>();
            var foglalas = await context.FoglalasAdatok.FindAsync(int.Parse(request.id));          
            if (foglalas == null)
            {
                return new ErrorModel("Nem található ilyen id-jű foglalás az adatbázisban");
            }
            var foglaltSzekek = await context.FoglaltSzekek.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.FoglalasAdatokid == foglalas.id)).ToListAsync();
            var uidb = int.TryParse(request.UserID, out int uid);
            var vidb = int.TryParse(request.VetitesID, out int vid);
            if (request.X.Count != request.Y.Count)
            {
                return new Models.ErrorModel("Azonos számú koordinátát kell megadni");
            }
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
            if (user == null)
            {
                return new Models.ErrorModel("Nem található ezzel az id-vel felhasználó az adatbázisban");
            }
            if (vetites == null)
            {
                return new Models.ErrorModel("Nem található ezzel az id-vel vetítés az adatbázisban");
            }
            if (uid!=user.userID)
            {
                patchDoc.Replace(foglalas => foglalas.UserID, uid);
            }
            var vetitesszekek = await context.VetitesSzekek.ToAsyncEnumerable().WhereAwait(async x =>
            {
                for (int i = 0; i < request.X.Count; i++)
                {
                    if (x.Vetitesid == vid && request.X[i].Equals(x.X.ToString()) && request.Y[i].Equals(x.Y.ToString()))
                    {
                        return await ValueTask.FromResult(true);
                    }
                }
                return await ValueTask.FromResult(false);
            }).ToListAsync();

            if (vetitesszekek.Count != request.X.Count)
            {
                return new Models.ErrorModel("Az egyik megadott hely nem található az adatbázisban");
            }
            if (await context.VetitesSzekek.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.FoglalasAllapot == 0)).AnyAsync())
            {
                return new Models.ErrorModel("Az egyik megadott hely nem elérhető");
            }

            patchDoc2.Replace(x=>x.FoglalasAllapot,1);
            foreach(var x in foglaltSzekek)
            {
                patchDoc2.ApplyTo(x.VetitesSzekek);
                context.FoglaltSzekek.Remove(x);
            }

            if (await context.VetitesSzekek.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(vetitesszekek.Contains(x) && x.FoglalasAllapot == 2)).AnyAsync())
            {
                return new Models.ErrorModel("Az egyik megadott hely már le lett foglalva");
            }
            patchDoc.ApplyTo(foglalas);
            var foglaltszekek = new List<FoglaltSzekek>();
            foreach (var h in vetitesszekek)
            {

                var fsz = new FoglaltSzekek { FoglalasAdatok = foglalas, VetitesSzekek = h };
                foglaltszekek.Add(fsz);
                h.FoglaltSzekek = fsz;
                h.FoglalasAllapot = 2;
            }
            context.UpdateRange(vetitesszekek);
            await context.FoglaltSzekek.AddRangeAsync(foglaltszekek);
            await context.SaveChangesAsync();
            return new Models.ErrorModel("Sikeres módosítás");
        }
        public async Task<Models.ErrorModel?> deleteFoglalas(int id)
        {
            var foglalas = await context.FoglalasAdatok.FindAsync(id);           
            if (foglalas == null)
            {
                return new ErrorModel("Nem található az adatbázisban foglalás a megadott id-vel");
            }
            var vetitesszekek = await context.VetitesSzekek.Include(x=>x.FoglaltSzekek).ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.FoglaltSzekek!=null&&x.FoglaltSzekek.FoglalasAdatokid==id)).ToListAsync();
            if (vetitesszekek.Count == 0)
            {
                return new ErrorModel("Nem található ehhez a foglaláshoz tartozó székfoglalás");
            }
            foreach (var h in vetitesszekek)
            {
                h.FoglalasAllapot = 1;
            }
            context.UpdateRange(vetitesszekek);
            context.FoglalasAdatok.Remove(foglalas);
            await context.SaveChangesAsync();
            return new ErrorModel("Sikeres törlés");
        }
    }
}
