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
using ReactApp1.Server.Entities;
using ReactApp1.Server.Services.Email;

namespace ReactApp1.Server.Services.Foglalas
{
    public class FoglalasService(DataBaseContext context, IConfiguration configuration, IEmailService emailService) : IFoglalasService
    {
        public async Task<List<JegyTipus>> getJegyTipusok()
        {
            return await context.JegyTipus.ToListAsync();
        }
        public async Task<List<GetFoglalasResponse>?> GetFoglalas()
        {
            var foglalasok = await context.FoglalasAdatok
        .AsNoTracking() 
        .Include(x => x.User)
        .Include(x => x.FoglaltSzekek)
            .ThenInclude(x => x.VetitesSzekek)
                .ThenInclude(x => x.Vetites)
                    .ThenInclude(x => x.Film)
        .Include(x => x.FoglaltSzekek)
            .ThenInclude(x => x.VetitesSzekek)
                .ThenInclude(x => x.Vetites)
                    .ThenInclude(x => x.Terem)
        .Include(x => x.FoglaltSzekek)
            .ThenInclude(x => x.JegyTipus)
        .Select(f => new GetFoglalasResponse(f)) 
        .ToListAsync();

            return foglalasok;
        }

        public async Task<List<GetFoglalasResponse>?> GetFoglalasByVetites(int vid)
        {
            var foglalasok = await context.FoglalasAdatok
        .AsNoTracking() 
        .Include(x => x.User)
        .Include(x => x.FoglaltSzekek)
            .ThenInclude(x => x.VetitesSzekek)
                .ThenInclude(x => x.Vetites)
                    .ThenInclude(x => x.Film)
        .Include(x => x.FoglaltSzekek)
            .ThenInclude(x => x.VetitesSzekek)
                .ThenInclude(x => x.Vetites)
                    .ThenInclude(x => x.Terem)
        .Include(x => x.FoglaltSzekek)
            .ThenInclude(x => x.JegyTipus)
        .Select(f => new GetFoglalasResponse(f))
        .ToListAsync();

            if (foglalasok.Count == 0)
            {
                return null;
            }
            return foglalasok;
        }

        public async Task<List<GetFoglalasResponse>?> GetFoglalasByUser(int uid)
        {
            var foglalasok = await context.FoglalasAdatok
                .Include(x => x.User)
                .Include(x => x.FoglaltSzekek)
                    .ThenInclude(x => x.VetitesSzekek)
                        .ThenInclude(x => x.Vetites)
                            .ThenInclude(x => x.Film)
                .Include(x => x.FoglaltSzekek)
                    .ThenInclude(x => x.VetitesSzekek)
                        .ThenInclude(x => x.Vetites)
                            .ThenInclude(x => x.Terem)
                .Include(x => x.FoglaltSzekek)
                    .ThenInclude(x => x.JegyTipus)
                .Where(x => x.UserID == uid)
                .ToListAsync();

            if (foglalasok.Count == 0)
            {
                return null;
            }
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
            if (request.X == null || request.Y == null || request.jegytipusId == null ||
                request.X.Count == 0 || request.Y.Count == 0 || request.jegytipusId.Count == 0)
            {
                return new Models.ErrorModel("Kötelező széket és jegy típust megadni");
            }
            if (request.X.Count != request.Y.Count || request.X.Count != request.jegytipusId.Count)
            {
                return new Models.ErrorModel("Azonos számú koordinátát és jegy típust kell megadni");
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
            var film = vetites != null ? await context.Film.FindAsync(vetites.Filmid) : null;

            if (user == null)
            {
                return new Models.ErrorModel("Nem található ezzel az id-vel felhasználó az adatbázisban");
            }
            if (vetites == null)
            {
                return new Models.ErrorModel("Nem található ezzel az id-vel vetítés az adatbázisban");
            }
            if (vetites.Idopont <= DateTime.Now)
            {
                return new Models.ErrorModel("Ez a vetítés már elkezdődött vagy befejeződött, nem lehet új foglalást tenni");
            }

            foglalas.UserID = uid;
            await context.AddAsync(foglalas);
            var vetitesszekek = new List<VetitesSzekek>();
            var jegyTipusok = new List<JegyTipus>();

            for (int i = 0; i < request.X.Count; i++)
            {
                var x = int.Parse(request.X[i]);
                var y = int.Parse(request.Y[i]);
                var jegyTipus = int.Parse(request.jegytipusId[i]);
                var dbJegyTipus = await context.JegyTipus.FindAsync(jegyTipus);
                if (dbJegyTipus == null)
                {
                    return new Models.ErrorModel($"Érvénytelen jegy típus azonosító: {jegyTipus}");
                }

                var seat = await context.VetitesSzekek
                    .FirstOrDefaultAsync(vs => vs.Vetitesid == vid && vs.X == x && vs.Y == y);

                if (seat == null)
                {
                    return new Models.ErrorModel($"A megadott hely ({x}, {y}) nem található az adatbázisban");
                }

                if (seat.FoglalasAllapot != 1)
                {
                    return new Models.ErrorModel($"A megadott hely ({x}, {y}) nem elérhető");
                }

                vetitesszekek.Add(seat);
                jegyTipusok.Add(dbJegyTipus);
            }
            var foglaltszekek = new List<FoglaltSzekek>();
            for (int i = 0; i < vetitesszekek.Count; i++)
            {
                var fsz = new FoglaltSzekek
                {
                    FoglalasAdatok = foglalas,
                    VetitesSzekek = vetitesszekek[i],
                    JegyTipus = jegyTipusok[i],
                    JegyTipusId = jegyTipusok[i].id
                };

                foglaltszekek.Add(fsz);
                vetitesszekek[i].FoglaltSzekek = fsz;
                vetitesszekek[i].FoglalasAllapot = 2;
            }

            context.UpdateRange(vetitesszekek);
            await context.AddRangeAsync(foglaltszekek);
            await context.SaveChangesAsync();

            try
            {
                var seatsList = string.Join(", ", vetitesszekek.Select((s, index) =>
                    $"{s.X + 1}. sor {s.Y + 1}. szék ({jegyTipusok[index].Nev} - {jegyTipusok[index].Ar} Ft)"));

                var totalPrice = jegyTipusok.Sum(j => j.Ar);

                var emailSubject = "Sikeres foglalás";
                var emailBody = $@"
                    <h2>Tisztelt {user.email}!</h2>
                    <p>Sikeresen lefoglalta a következő helyeket:</p>
                    <p><strong>Film:</strong> {film?.Cim ?? "Ismeretlen film"}</p>
                    <p><strong>Vetítés ideje:</strong> {vetites.Idopont.ToString("yyyy.MM.dd HH:mm")}</p>
                    <p><strong>Foglalt helyek:</strong> {seatsList}</p>
                    <p><strong>Összesen:</strong> {totalPrice} Ft</p>
                    <p><strong>Foglalás azonosító:</strong> {foglalas.id}</p>
                    <p>Köszönjük, hogy minket választott!</p>
                ";

                await emailService.SendEmailAsync(user.email, emailSubject, emailBody);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending confirmation email: {ex.Message}");
            }

            return new Models.ErrorModel("Sikeres hozzáadás");
        }

        public async Task<Models.ErrorModel?> editFoglalas(ManageFoglalasDto request)
        {
            if (string.IsNullOrEmpty(request.id))
            {
                return new ErrorModel("Érvénytelen foglalás azonosító");
            }

            var patchDoc = new JsonPatchDocument<Entities.Foglalas.FoglalasAdatok>();
            var patchDoc2 = new JsonPatchDocument<Entities.Vetites.VetitesSzekek>();

            var foglalas = await context.FoglalasAdatok.FindAsync(int.Parse(request.id));
            if (foglalas == null)
            {
                return new ErrorModel("Nem található ilyen id-jű foglalás az adatbázisban");
            }

            var foglaltSzekek = await context.FoglaltSzekek
                .Include(fs => fs.JegyTipus)
                .Include(fs => fs.VetitesSzekek)
                .Where(x => x.FoglalasAdatokid == foglalas.id)
                .ToListAsync();

            var uidb = int.TryParse(request.UserID, out int uid);
            var vidb = int.TryParse(request.VetitesID, out int vid);

            if (request.X == null || request.Y == null || request.jegytipusId == null ||
                request.X.Count != request.Y.Count || request.X.Count != request.jegytipusId.Count)
            {
                return new Models.ErrorModel("Azonos számú koordinátát és jegy típust kell megadni");
            }
            if (request.X.Count == 0)
            {
                return new ErrorModel("Kötelező széket megadni a foglaláshoz");
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
            if (uid != user.userID)
            {
                patchDoc.Replace(foglalas => foglalas.UserID, uid);
            }
            var vetitesszekek = new List<VetitesSzekek>();
            var jegyTipusok = new List<JegyTipus>();

            for (int i = 0; i < request.X.Count; i++)
            {
                var x = int.Parse(request.X[i]);
                var y = int.Parse(request.Y[i]);
                var jegyTipus = int.Parse(request.jegytipusId[i]);
                var dbJegyTipus = await context.JegyTipus.FindAsync(jegyTipus);
                if (dbJegyTipus == null)
                {
                    return new Models.ErrorModel($"Érvénytelen jegy típus azonosító: {jegyTipus}");
                }

                var seat = await context.VetitesSzekek
                    .FirstOrDefaultAsync(vs => vs.Vetitesid == vid && vs.X == x && vs.Y == y);
                if (seat == null)
                {
                    return new Models.ErrorModel($"A megadott hely ({x}, {y}) nem található az adatbázisban");
                }

                if (seat.FoglalasAllapot == 0)
                {
                    return new Models.ErrorModel($"A megadott hely ({x}, {y}) nem elérhető");
                }

                vetitesszekek.Add(seat);
                jegyTipusok.Add(dbJegyTipus);
            }
            patchDoc2.Replace(x => x.FoglalasAllapot, 1);
            foreach (var x in foglaltSzekek)
            {
                patchDoc2.ApplyTo(x.VetitesSzekek);
                context.FoglaltSzekek.Remove(x);
            }
            if (vetitesszekek.Any(x => x.FoglalasAllapot == 2))
            {
                return new Models.ErrorModel("Az egyik megadott hely már le lett foglalva");
            }
            patchDoc.ApplyTo(foglalas);
            var newFoglaltszekek = new List<FoglaltSzekek>();

            for (int i = 0; i < vetitesszekek.Count; i++)
            {
                var fsz = new FoglaltSzekek
                {
                    FoglalasAdatok = foglalas,
                    VetitesSzekek = vetitesszekek[i],
                    JegyTipus = jegyTipusok[i],
                    JegyTipusId = jegyTipusok[i].id
                };

                newFoglaltszekek.Add(fsz);
                vetitesszekek[i].FoglaltSzekek = fsz;
                vetitesszekek[i].FoglalasAllapot = 2;
            }

            context.UpdateRange(vetitesszekek);
            await context.FoglaltSzekek.AddRangeAsync(newFoglaltszekek);
            await context.SaveChangesAsync();
            try
            {
                var film = await context.Film.FindAsync(vetites.Filmid);
                var seatsList = string.Join(", ", vetitesszekek.Select((s, index) =>
                    $"{s.X + 1}. sor {s.Y + 1}. szék ({jegyTipusok[index].Nev} - {jegyTipusok[index].Ar} Ft)"));

                var totalPrice = jegyTipusok.Sum(j => j.Ar);

                var emailSubject = "A foglalása megváltozott";
                var emailBody = $@"
        <h2>Tisztelt {user.email}!</h2>
        <p>Sikeresen módosította a foglalását:</p>
        <p><strong>Film:</strong> {film?.Cim ?? "Ismeretlen film"}</p>
        <p><strong>Vetítés ideje:</strong> {vetites.Idopont.ToString("yyyy.MM.dd HH:mm")}</p>
        <p><strong>Foglalt helyek:</strong> {seatsList}</p>
        <p><strong>Összesen:</strong> {totalPrice} Ft</p>
        <p><strong>Foglalás azonosító:</strong> {foglalas.id}</p>
        <p>Köszönjük, hogy minket választott!</p>
    ";

                await emailService.SendEmailAsync(user.email, emailSubject, emailBody);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending confirmation email: {ex.Message}");
            }
            return new Models.ErrorModel("Sikeres módosítás");
        }

        public async Task<Models.ErrorModel?> deleteFoglalas(int id)
        {
            var foglalas = await context.FoglalasAdatok.FindAsync(id);
            if (foglalas == null)
            {
                return new ErrorModel("Nem található az adatbázisban foglalás a megadott id-vel");
            }

            var vetitesszekek = await context.VetitesSzekek
                .Include(x => x.FoglaltSzekek)
                .Where(x => x.FoglaltSzekek != null && x.FoglaltSzekek.FoglalasAdatokid == id)
                .ToListAsync();

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