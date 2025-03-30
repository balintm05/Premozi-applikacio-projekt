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


namespace ReactApp1.Server.Services.Terem
{
    public class TeremService(DataBaseContext context, IConfiguration configuration) : ITeremService
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
            try
            {
                var terem = await context.Terem
                    .Include(t => t.Szekek)
                    .FirstOrDefaultAsync(t => t.id == int.Parse(request.id));

                if (terem == null) return new Models.ErrorModel("Terem nem található");

                var patchDoc = new JsonPatchDocument<Entities.Terem.Terem>();

                if (!string.IsNullOrEmpty(request.Nev))
                    patchDoc.Replace(t => t.Nev, request.Nev);

                if (!string.IsNullOrEmpty(request.Megjegyzes))
                    patchDoc.Replace(t => t.Megjegyzes, request.Megjegyzes);

                patchDoc.ApplyTo(terem);

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
                            context.Szekek.Add(new Szekek
                            {
                                X = x,
                                Y = y,
                                Teremid = terem.id,
                                Allapot = op.value
                            });
                        }
                    }
                }

                await context.SaveChangesAsync();
                return new Models.ErrorModel("Sikeres módosítás");
            }
            catch (Exception ex)
            {
                return new Models.ErrorModel($"Hiba: {ex.Message}");
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
            var szekek = new List<Szekek>();
            for (int x = 0; x < sorok; x++)
            {
                for (int y = 0; y < oszlopok; y++)
                {
                    szekek.Add(new Szekek { Terem = terem, X = x, Y = y });
                }
            }
            foreach (var szek in szekek)
            {
                await context.Szekek.AddAsync(szek);
            }
        }
        private async Task DeleteExistingSzekek(Entities.Terem.Terem terem)
        {
            var szekek = await context.Szekek.ToAsyncEnumerable().WhereAwait(async x => await ValueTask.FromResult(x.Terem.id == terem.id)).ToListAsync();
            context.RemoveRange(szekek);
            await context.SaveChangesAsync();
        }


        //!!!!!!!!!! szék frissítő cucc ide majd (ami frissíti a hozzá tartozó vetítések állapotát is (0))
    }
}
