using ReactApp1.Server.Data;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models.Vetites;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.AspNetCore.JsonPatch;
using ReactApp1.Server.Entities.Vetites;
using ReactApp1.Server.Services.Email;
using ReactApp1.Server.Entities;

namespace ReactApp1.Server.Services.Vetites
{
    public class VetitesService(DataBaseContext context, IConfiguration configuration, IEmailService emailService) : IVetitesService
    {
        public async Task<List<GetVetitesResponse>?> getVetites()
        {
            var vetitesek = await context.Vetites.AsNoTracking().AsSplitQuery().IgnoreAutoIncludes().Include(x=>x.Film).IgnoreAutoIncludes().Include(x => x.Terem).IgnoreAutoIncludes().Include(x => x.Film).ThenInclude(x => x.Images).IgnoreAutoIncludes().ToListAsync();
            var response = new List<GetVetitesResponse>();
            foreach(var vetites in vetitesek)
            {
                response.Add(new GetVetitesResponse(vetites));
            }
            return response;
        }
        public async Task<GetVetitesResponse?> getVetites(int id)
        {
            var vetites = await context.Vetites.AsNoTracking().AsSplitQuery().IgnoreAutoIncludes().Include(x => x.Film).IgnoreAutoIncludes().Include(x=>x.VetitesSzekek).IgnoreAutoIncludes().Include(x => x.Terem).IgnoreAutoIncludes().Include(x => x.Film).ThenInclude(x => x.Images).IgnoreAutoIncludes().ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.id == id)).ToListAsync();
            if (vetites == null || vetites.Count()==0)
            {
                return new GetVetitesResponse("Nincs ilyen id-jű vetítés az adatbázisban");
            }
            return new GetVetitesResponse(vetites.First());
        }
        public async Task<ErrorModel> addVetites(ManageVetitesDto request)
        {            
            var vetites = new Entities.Vetites.Vetites();
            var vetitesszekek = new List<VetitesSzekek>();
            var filmek = await context.Film.ToListAsync();
            var fidb = int.TryParse(request.Filmid, out int fid);
            var tidb = int.TryParse(request.Teremid, out int tid);
            var didb = DateTime.TryParse(request.Idopont, out DateTime ido);
            if (!(fidb && tidb))
            {
                return new ErrorModel("Számot kell megadni a film és terem id-hez");
            }
            if (!didb)
            {
                return new ErrorModel("Valid dátumot kell megadni");
            }
            var terem = await context.Terem.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.id == tid)).ToListAsync();
            var film = await context.Film.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.id == fid)).ToListAsync();
            if (terem.Count==0)
            {
                return new ErrorModel("Nem található ilyen id-jű terem az adatbázisban");
            }
            if(film.Count==0)
            {
                return new ErrorModel("Nem található ilyen id-jű film az adatbázisban");
            }
            vetites.Filmid = fid;
            vetites.Teremid = tid;
            vetites.Idopont = ido;
            if(vetites.Idopont< DateTime.Now)
            {
                return new ErrorModel("A vetítés nem lehet a múltban");
            }
            if (await context.Vetites.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.Teremid == tid && 
                x.Idopont <= vetites.Idopont.AddMinutes(film[0].Jatekido) && x.Idopont.AddMinutes(filmek.Where(y => y.id == x.Filmid).First().Jatekido) >= vetites.Idopont))
                .AnyAsync())
            {
                return new ErrorModel("Már szerepel ebben az időközben vetítés ebben a teremben az adatbázisban");
            }
            if (!(ido.TimeOfDay >= TimeSpan.FromHours(12) && (ido.TimeOfDay + TimeSpan.FromMinutes(film.First().Jatekido)) <= TimeSpan.FromHours(23)))
            {
                return new ErrorModel("A vetítésnek nyitvatartási időn belül kell lennie (12:00 - 23:00)");
            }
            if (request.Megjegyzes != null)
            {
                vetites.Megjegyzes = request.Megjegyzes;
            }
            await context.Vetites.AddAsync(vetites);
            await CreateVSzekek(vetites);
            await context.SaveChangesAsync();
            return new ErrorModel("Sikeres hozzáadás");
        }
        public async Task<ErrorModel?> editVetites(ManageVetitesDto request)
        {
            var vetites = await context.Vetites.FindAsync(int.Parse(request.id));
            var filmek = await context.Film.ToListAsync();
            if (vetites == null)
            {
                return new ErrorModel("Nem található ilyen id-jű vetítés az adatbázisban");
            }
            if (vetites.Idopont < DateTime.Now)
            {
                return new ErrorModel("A már megtörtént vetítés nem módosítható!");
            }
            
            var patchDoc = new JsonPatchDocument<Entities.Vetites.Vetites>();
            var fidb = int.TryParse(request.Filmid, out int fid);
            var tidb = int.TryParse(request.Teremid, out int tid);
            var didb = DateTime.TryParse(request.Idopont, out DateTime ido);
            if (!(fidb && tidb))
            {
                return new ErrorModel("Számot kell megadni a film és terem id-hez");
            }
            if (!didb)
            {
                return new ErrorModel("Valid dátumot kell megadni");
            }
            if (request.Megjegyzes!=null && vetites.Megjegyzes != request.Megjegyzes)
            {
                patchDoc.Replace(vetites => vetites.Megjegyzes , request.Megjegyzes);
            }
            if (vetites.Teremid != tid)
            {
                var terem = await context.Terem.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.id == tid)).ToListAsync();
                if(terem == null)
                {
                    return new ErrorModel("Nem található ilyen id-jű terem az adatbázisban");
                }
                patchDoc.Replace(x=>x.Teremid , tid);
                await DeleteExistingVSzekek(vetites);
                await CreateVSzekek(vetites);
            }
            if (vetites.Filmid != fid)
            {
                var film = await context.Film.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.id == fid)).ToListAsync();
                if (film == null)
                {
                    return new ErrorModel("Nem található ilyen id-jű film az adatbázisban");
                }
                patchDoc.Replace(vetites => vetites.Filmid, fid);         
            }
            if (ido < DateTime.Now)
            {
                return new ErrorModel("A vetítés nem lehet a múltban");
            }
            if (vetites.Idopont != ido)
            {
                if (await context.Vetites.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.Teremid == tid &&
                x.Idopont <= vetites.Idopont.AddMinutes(vetites.Film.Jatekido) && x.Idopont.AddMinutes(filmek.Where(y => y.id == x.Filmid).First().Jatekido) >= vetites.Idopont
                && x.id!=int.Parse(request.id)))
                .AnyAsync())
                {
                    return new ErrorModel("Már szerepel ebben az időközben vetítés ebben a teremben az adatbázisban");
                }
                if (!(ido.TimeOfDay >= TimeSpan.FromHours(12) && (ido.TimeOfDay + TimeSpan.FromMinutes(vetites.Film.Jatekido)) <= TimeSpan.FromHours(23)))
                {
                    return new ErrorModel("A vetítésnek nyitvatartási időn belül kell lennie (12:00 - 23:00)");
                }
                patchDoc.Replace(vetites => vetites.Idopont , ido);
            }           
            patchDoc.ApplyTo(vetites);
            await context.SaveChangesAsync();
            return new ErrorModel("Sikeres módosítás");
        }
        public async Task<ErrorModel> deleteVetites(int id)
        {
            using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                var vetites = await context.Vetites
                    .Include(v => v.VetitesSzekek)
                    .ThenInclude(vsz=>vsz.FoglaltSzekek)
                    .ThenInclude(fsz=>fsz.FoglalasAdatok).IgnoreAutoIncludes()
                    .Include(v => v.Terem).IgnoreAutoIncludes()
                    .Include(v => v.Film).IgnoreAutoIncludes()
                    .FirstOrDefaultAsync(v => v.id == id);
                if (vetites == null)
                {
                    return new ErrorModel("Nem található ilyen id-jű vetítés az adatbázisban");
                }
                if (vetites.Idopont < DateTime.Now)
                {
                    return new ErrorModel("A már megtörtént vetítés nem törölhető!");
                }
                var affectedUsers = new Dictionary<int, List<(VetitesSzekek seat, Entities.Vetites.Vetites vetites)>>();
                foreach (var seat in vetites.VetitesSzekek.Where(s => s.FoglalasAllapot == 2))
                {
                    await TrackAffectedUser(seat, vetites, affectedUsers);
                }
                context.Vetites.Remove(vetites);
                await context.SaveChangesAsync();
                await SendNotificationsToAffectedUsers(affectedUsers);

                await transaction.CommitAsync();
                return new ErrorModel("Sikeres törlés");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new ErrorModel($"Hiba történt a törlés során: {ex.Message}");
            }
        }

        private async Task TrackAffectedUser(VetitesSzekek seat, Entities.Vetites.Vetites vetites,
            Dictionary<int, List<(VetitesSzekek seat, Entities.Vetites.Vetites vetites)>> affectedUsers)
        {
            var foglaltSzek = await context.FoglaltSzekek
                .Include(fs => fs.FoglalasAdatok)
                    .ThenInclude(fa => fa.User)
                .FirstOrDefaultAsync(fs =>
                    fs.Vetitesid == seat.Vetitesid &&
                    fs.X == seat.X &&
                    fs.Y == seat.Y);

            if (foglaltSzek?.FoglalasAdatok?.User != null)
            {
                var userId = foglaltSzek.FoglalasAdatok.User.userID;
                if (!affectedUsers.ContainsKey(userId))
                {
                    affectedUsers[userId] = new List<(VetitesSzekek, Entities.Vetites.Vetites)>();
                }
                affectedUsers[userId].Add((seat, vetites));
                context.FoglaltSzekek.Remove(foglaltSzek);
            }
        }

        private async Task SendNotificationsToAffectedUsers(Dictionary<int, List<(VetitesSzekek seat, Entities.Vetites.Vetites vetites)>> affectedUsers)
        {
            foreach (var userEntry in affectedUsers)
            {
                var userId = userEntry.Key;
                var user = await context.Users.FindAsync(userId);
                if (user == null) continue;

                var vetitesek = userEntry.Value
                    .GroupBy(x => x.vetites)
                    .Select(g => new {
                        Vetites = g.Key,
                        Seats = g.Select(x => x.seat).ToList()
                    }).ToList();

                var emailBody = new StringBuilder()
                    .AppendLine("<h2>Tisztelt Felhasználó!</h2>")
                    .AppendLine("<p>A következő foglalásait töröltük, mert a vetítés törlésre került:</p>");

                foreach (var vetites in vetitesek)
                {
                    emailBody.AppendLine($"<h3>{vetites.Vetites.Film?.Cim ?? "Ismeretlen film"} - {vetites.Vetites.Terem?.Nev ?? "Ismeretlen terem"}</h3>")
                            .AppendLine($"<p><strong>Foglalás azonosító:</strong> {vetites.Seats.FirstOrDefault()?.FoglaltSzekek?.FoglalasAdatok?.id}</p>")
                            .AppendLine($"<p><strong>Időpont:</strong> {vetites.Vetites.Idopont:yyyy.MM.dd HH:mm}</p>")
                            .AppendLine("<p><strong>Érintett székek:</strong></p><ul>");

                    foreach (var seat in vetites.Seats)
                    {
                        emailBody.AppendLine($"<li>{seat.X + 1}. sor, {seat.Y + 1}. szék</li>");
                    }
                    emailBody.AppendLine("</ul>");
                }

                emailBody.AppendLine("<p>Kérjük, nézze meg a jelenleg elérhető vetítéseinket.</p>");

                await emailService.SendEmailAsync(
                    user.email,
                    "Vetítés törölve - foglalásai érintve lettek",
                    emailBody.ToString()
                );
            }
        }
        private async Task CreateVSzekek(Entities.Vetites.Vetites vetites)
        {
            var vszekek = new List<VetitesSzekek>();
            var szekek = await context.Szekek.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.Teremid == vetites.Teremid)).ToListAsync();
            var sorok = szekek.Where(x => x.X == 0).Count();
            var oszlopok = szekek.Where(x => x.Y == 0).Count();
            Console.WriteLine("{0}, {1}", sorok, oszlopok);
            for (int x = 0; x < sorok; x++)
            {
                for (int y = 0; y < oszlopok; y++)
                {
                    var t = new VetitesSzekek { Vetites = vetites, X = szekek[x * oszlopok + y].X, Y = szekek[x*oszlopok+y].Y , FoglalasAllapot = szekek[x * oszlopok + y].Allapot};                   
                    vszekek.Add(t);
                }
            }
            foreach (var szek in vszekek)
            {
                await context.VetitesSzekek.AddAsync(szek);
            }
            await context.SaveChangesAsync();
        }
        private async Task DeleteExistingVSzekek(Entities.Vetites.Vetites vetites)
        {
            var szekek = await context.VetitesSzekek.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.Vetitesid == vetites.id)).ToListAsync();
            context.RemoveRange(szekek);
            await context.SaveChangesAsync();
        }
    }
}
