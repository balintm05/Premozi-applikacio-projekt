using ReactApp1.Server.Data;
using ReactApp1.Server.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using ReactApp1.Server.Data;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.SignalR;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Models.JWT;
using ReactApp1.Server.Models.User;
using ReactApp1.Server.Models.User.EditUser;
using NuGet.Common;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using ReactApp1.Server.Models.User.Response;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models.Film.ManageFilm;
using Humanizer;
using Org.BouncyCastle.Ocsp;
using ReactApp1.Server.Models.Film;
using ReactApp1.Server.Models.Terem;
using ReactApp1.Server.Entities.Terem;
using ReactApp1.Server.Entities.Vetites;
using ReactApp1.Server.Services.Email;


namespace ReactApp1.Server.Services.Terem
{
    public class TeremService(DataBaseContext context, IConfiguration configuration, IEmailService emailService) : ITeremService
    {
        public async Task<List<GetTeremResponse>?> getTerem()
        {
            var termek = await context.Terem.Include(x => x.Szekek).ToListAsync();
            var szekek = await context.Szekek.ToListAsync();
            var response = new List<GetTeremResponse>();
            foreach (var terem in termek)
            {
                response.Add(new GetTeremResponse(terem));
            }
            return response;
        }
        public async Task<GetTeremResponse?> getTerem(int id)
        {
            var terem = await context.Terem.FindAsync(id);
            var szekek = await context.Szekek.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.Teremid == id)).ToListAsync();
            var response = new List<GetTeremResponse>();
            if (terem == null)
            {
                return new GetTeremResponse("Nincs ilyen id-jű terem az adatbázisban");
            }
            return new GetTeremResponse(terem);
        }
        public async Task<Models.ErrorModel?> addTerem(ManageTeremDto request)
        {
            try
            {
                var terem = new Entities.Terem.Terem();
                var szekek = new List<Szekek>();
                terem.Nev = request.Nev;
                bool s = int.TryParse(request.Sorok, out int sorok);
                bool o = int.TryParse(request.Oszlopok, out int oszlopok);
                if (s && o)
                {
                    await context.Terem.AddAsync(terem);
                    await CreateSzekek(sorok, oszlopok, terem);
                    await context.SaveChangesAsync();
                    return new Models.ErrorModel("Sikeres hozzáadás");
                }
                else
                {
                    return new Models.ErrorModel("Számot kell megadni a sorok és oszlopok számához");
                }
            }
            catch (Exception ex)
            {
                return new Models.ErrorModel(ex.Message);
            }
        }

        public async Task<Models.ErrorModel?> editTerem(ManageTeremDto request)
        {
            using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                var terem = await context.Terem
                    .Include(t => t.Szekek)
                    .Include(t => t.Vetites)
                        .ThenInclude(v => v.VetitesSzekek)
                    .FirstOrDefaultAsync(t => t.id == int.Parse(request.id));
                if (terem == null) return new Models.ErrorModel("Terem nem található");
                var patchDoc = new JsonPatchDocument<Entities.Terem.Terem>();
                if (!string.IsNullOrEmpty(request.Nev))
                    patchDoc.Replace(t => t.Nev, request.Nev);
                if (!string.IsNullOrEmpty(request.Megjegyzes))
                    patchDoc.Replace(t => t.Megjegyzes, request.Megjegyzes);
                patchDoc.ApplyTo(terem);
                var affectedUsers = new Dictionary<int, List<(VetitesSzekek seat, Entities.Vetites.Vetites vetites)>>();
                if (request.SzekekFrissites != null)
                {
                    foreach (var op in request.SzekekFrissites)
                    {
                        var pathParts = op.path.Split('/');
                        var coordPart = pathParts[pathParts.Length - 2];
                        var coords = coordPart.Split('-');
                        if (coords.Length != 2) continue;
                        int x = int.Parse(coords[0]);
                        int y = int.Parse(coords[1]);
                        var seat = terem.Szekek.FirstOrDefault(s => s.X == x && s.Y == y);
                        if (seat != null)
                        {
                            var seatPatch = new JsonPatchDocument<Szekek>();
                            seatPatch.Replace(s => s.Allapot, op.value);
                            seatPatch.ApplyTo(seat);
                        }
                        else
                        {
                            seat = new Szekek
                            {
                                X = x,
                                Y = y,
                                Teremid = terem.id,
                                Allapot = op.value
                            };
                            context.Szekek.Add(seat);
                        }
                        foreach (var vetites in terem.Vetites)
                        {
                            var vetitesSeat = vetites.VetitesSzekek.FirstOrDefault(vs => vs.X == x && vs.Y == y);
                            if (vetitesSeat != null)
                            {
                                if (vetitesSeat.FoglalasAllapot == 2 && op.value != 2)
                                {
                                    await TrackAffectedUser(vetitesSeat, vetites, affectedUsers);
                                }
                                vetitesSeat.FoglalasAllapot = op.value; 
                            }
                            else
                            {
                                vetites.VetitesSzekek.Add(new VetitesSzekek
                                {
                                    X = x,
                                    Y = y,
                                    FoglalasAllapot = op.value
                                });
                            }
                        }
                    }
                }

                await context.SaveChangesAsync();
                await SendNotificationsToAffectedUsers(affectedUsers); 
                await transaction.CommitAsync();
                return new Models.ErrorModel("Sikeres módosítás");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new Models.ErrorModel($"Hiba: {ex.Message}");
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
                    .AppendLine("<p>A következő foglalásait kellett törölnünk:</p>");
                foreach (var vetites in vetitesek)
                {
                    var film = await context.Film.FindAsync(vetites.Vetites.Filmid);
                    var terem = await context.Terem.FindAsync(vetites.Vetites.Teremid);
                    var foglalasId = vetites.Seats.FirstOrDefault()?.FoglaltSzekek?.FoglalasAdatok?.id;

                    emailBody.AppendLine($"<h3>{film?.Cim ?? "Ismeretlen film"} - {terem?.Nev ?? "Ismeretlen terem"}</h3>")
                            .AppendLine($"<p><strong>Foglalás azonosító:</strong> {foglalasId}</p>")
                            .AppendLine($"<p><strong>Időpont:</strong> {vetites.Vetites.Idopont:yyyy.MM.dd HH:mm}</p>")
                            .AppendLine("<p><strong>Érintett székek:</strong></p><ul>");
                    foreach (var seat in vetites.Seats)
                    {
                        emailBody.AppendLine($"<li>{seat.X + 1}. sor, {seat.Y + 1}. szék</li>");
                    }
                    emailBody.AppendLine("</ul>");
                }
                emailBody.AppendLine("<p>Kérjük, foglaljon másik széket.</p>")
                        .AppendLine("<p>Üdvözlettel,<br>Premozi</p>");
                await emailService.SendEmailAsync(
                    user.email,
                    "Foglalásaid változtak",
                    emailBody.ToString()
                );
            }
        }

        public async Task<Models.ErrorModel?> deleteTerem(int id)
        {
            var terem = await context.Terem.FindAsync(id);
            if (terem == null)
            {
                return new Models.ErrorModel("Nem található ilyen id-jű terem az adatbázisban");
            }
            context.Terem.Remove(terem);
            await context.SaveChangesAsync();
            return new Models.ErrorModel("Sikeres törlés");
        }
        public async Task<Models.ErrorModel?> EditSzekek(List<Szekek> szekekUpdate)
        {
            var szekekOld = await context.Szekek.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.Terem.id == szekekUpdate[0].Teremid)).ToListAsync();
            return null;
        }
        private async Task CreateSzekek(int sorok, int oszlopok, Entities.Terem.Terem terem)
        {
            var existingSeats = await context.Szekek
                .Where(s => s.Teremid == terem.id)
                .ToListAsync();

            var newSeats = new List<Szekek>();
            for (int x = 0; x < sorok; x++)
            {
                for (int y = 0; y < oszlopok; y++)
                {
                    if (!existingSeats.Any(s => s.X == x && s.Y == y))
                    {
                        newSeats.Add(new Szekek
                        {
                            Teremid = terem.id,
                            X = x,
                            Y = y,
                            Allapot = 1
                        });
                    }
                }
            }
            await context.Szekek.AddRangeAsync(newSeats);
            var vetitesek = await context.Vetites
                .Where(v => v.Teremid == terem.id)
                .Include(v => v.VetitesSzekek)
                .ToListAsync();
            foreach (var vetites in vetitesek)
            {
                foreach (var seat in newSeats)
                {
                    if (!vetites.VetitesSzekek.Any(vs => vs.X == seat.X && vs.Y == seat.Y))
                    {
                        vetites.VetitesSzekek.Add(new VetitesSzekek
                        {
                            X = seat.X,
                            Y = seat.Y,
                            FoglalasAllapot = seat.Allapot
                        });
                    }
                }
            }
        }
    }
}
