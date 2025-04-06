using ReactApp1.Server.Data;
using ReactApp1.Server.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using ReactApp1.Server.Data;
using ReactApp1.Server.Entities;
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
using ReactApp1.Server.Entities.Terem;
using ReactApp1.Server.Models.Terem;
using Microsoft.Extensions.Hosting;
using System.Text.Json.Nodes;
using ReactApp1.Server.Models;
using ReactApp1.Server.Services.Email;
using ReactApp1.Server.Entities.Vetites;

namespace ReactApp1.Server.Services.Film
{
    public class FilmService(DataBaseContext context, IConfiguration configuration, IHttpClientFactory httpClientFactory, IEmailService emailService) :IFilmService
    {
        public async Task<List<Entities.Film>?> queryFilm(GetFilmQueryFilter request)
        {
            try
            {
                var movies = await context.Film.Include(x=>x.Images).ToListAsync();
                if (!string.IsNullOrEmpty(request.id) && int.TryParse(request.id, out int r))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => await ValueTask.FromResult(user.id.ToString().Equals(request.id))).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Kategoria))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => await ValueTask.FromResult(user.Kategoria.ToLower().Contains(request.Kategoria.ToLower()))).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Mufaj))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => await ValueTask.FromResult(user.Mufaj.ToLower().Contains(request.Mufaj.ToLower()))).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Korhatar))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => await ValueTask.FromResult(user.Korhatar.ToLower().StartsWith(request.Korhatar.ToLower()))).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Jatekido) && int.TryParse(request.Jatekido, out int j))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => await ValueTask.FromResult(user.Jatekido.ToString().StartsWith(request.Jatekido))).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Gyarto))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => await ValueTask.FromResult(user.Gyarto.ToLower().Contains(request.Gyarto.ToLower()))).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Rendezo))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => await ValueTask.FromResult(user.Rendezo.ToLower().Contains(request.Rendezo.ToLower()))).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Szereplok))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => await ValueTask.FromResult(user.Szereplok.ToLower().Contains(request.Szereplok.ToLower()))).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Leiras))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => await ValueTask.FromResult(user.Leiras.ToLower().Contains(request.Leiras.ToLower()))).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.EredetiNyelv))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => await ValueTask.FromResult(user.EredetiNyelv.ToLower().StartsWith(request.EredetiNyelv.ToLower()))).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.EredetiCim))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => await ValueTask.FromResult(user.EredetiCim.ToLower().StartsWith(request.EredetiCim.ToLower()))).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Szinkron))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => await ValueTask.FromResult(user.Szinkron.ToLower().StartsWith(request.Szinkron.ToLower()))).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.IMDB))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => await ValueTask.FromResult(user.IMDB.ToLower().StartsWith(request.IMDB.ToLower()))).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Megjegyzes))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => await ValueTask.FromResult(user.Megjegyzes.ToLower().Contains(request.Megjegyzes.ToLower()))).ToListAsync();
                }
                return movies;
            }
            catch(Exception ex) 
            {
                return null;
            }
        }


        public async Task<List<Entities.Film>?> getFilm()
        {
            return await context.Film.Include(x => x.Images).Include(x=>x.Vetitesek).ToListAsync();
        }
        public async Task<Entities.Film?> getFilm(int id)
        { 
            var film = await context.Film.Include(x=>x.Vetitesek).ThenInclude(x=>x.Terem).Include(x => x.Images).FirstOrDefaultAsync(x=>x.id==id);
            return film;
        }


        public async Task<Models.ErrorModel?> addFilm(ManageFilmDto request, HttpContext httpContext)
        {
            try
            {
                var movie = new Entities.Film();
                movie.Cim = request.Cim;
                movie.Kategoria = request.Kategoria;
                movie.Mufaj = request.Mufaj;
                movie.Korhatar = request.Korhatar;
                movie.Jatekido = int.TryParse(request.Jatekido, out int res) ? res : throw new Exception("Nem számot adott meg");
                movie.Gyarto = request.Gyarto;
                movie.Rendezo = request.Rendezo;
                movie.Szereplok = request.Szereplok;
                movie.Leiras = request.Leiras;
                movie.EredetiNyelv = request.EredetiNyelv;
                movie.EredetiCim = request.EredetiCim;
                movie.Szinkron = request.Szinkron;
                movie.TrailerLink = request.TrailerLink;
                movie.IMDB = request.IMDB;
                movie.Megjegyzes = !string.IsNullOrEmpty(request.Megjegyzes) ? request.Megjegyzes : "";
                if (request.image != null)
                {
                    var httpClient = httpClientFactory.CreateClient("ImageUpload");
                    httpClient.DefaultRequestHeaders.Add("X-Internal-Request", "True");
                    httpClient.DefaultRequestHeaders.Add("Role", "Admin");
                    using var content = new MultipartFormDataContent();
                    using var fileStream = request.image.OpenReadStream();
                    content.Add(new StreamContent(fileStream), "file", request.image.FileName);
                    var response = await httpClient.PostAsync("api/image/upload", content);
                    if (!response.IsSuccessStatusCode)
                    {
                        var errorContent = await response.Content.ReadAsStringAsync();
                        return new Models.ErrorModel($"Sikertelen fájlfeltöltés: {response.StatusCode} - {errorContent}");
                    }
                    var result = await response.Content.ReadFromJsonAsync<ImageUploadResponse>();
                    if (result == null)
                    {
                        return new Models.ErrorModel("Sikertelen fájlfeldolgozás");
                    }
                    movie.ImageID = result.Id;
                }
                else if (request.imageId.HasValue)
                {
                    var existingImage = await context.Images.FindAsync(request.imageId.Value);
                    if (existingImage == null)
                    {
                        return new Models.ErrorModel("A kiválasztott kép nem található a könyvtárban");
                    }
                    movie.ImageID = request.imageId.Value;
                }
                else
                {
                    return new Models.ErrorModel("Kérem válasszon képet vagy töltsön fel újat");
                }

                await context.Film.AddAsync(movie);
                await context.SaveChangesAsync();
                return new Models.ErrorModel("Sikeres hozzáadás");
            }
            catch (Exception ex)
            {
                return new Models.ErrorModel(ex.Message);
            }
        }

        public async Task<Models.ErrorModel?> editFilm(ManageFilmDto request, HttpContext httpContext)
        {
            try
            {
                var movie = await context.Film
                    .Include(f => f.Images)
                    .FirstOrDefaultAsync(f => f.id == int.Parse(request.id));
                if (movie == null)
                {
                    return new Models.ErrorModel("Nem található ilyen id-jű film");
                }
                var patchDoc = new JsonPatchDocument<Entities.Film>();
                if (request.Cim != null) patchDoc.Replace(f => f.Cim, request.Cim);
                if (request.Kategoria != null) patchDoc.Replace(f => f.Kategoria, request.Kategoria);
                if (request.Mufaj != null) patchDoc.Replace(f => f.Mufaj, request.Mufaj);
                if (request.Korhatar != null) patchDoc.Replace(f => f.Korhatar, request.Korhatar);
                if (!string.IsNullOrEmpty(request.Jatekido))
                {
                    if (int.TryParse(request.Jatekido, out int jatekido))
                    {
                        patchDoc.Replace(f => f.Jatekido, jatekido);
                    }
                }
                if (request.Gyarto != null) patchDoc.Replace(f => f.Gyarto, request.Gyarto);
                if (request.Rendezo != null) patchDoc.Replace(f => f.Rendezo, request.Rendezo);
                if (request.Szereplok != null) patchDoc.Replace(f => f.Szereplok, request.Szereplok);
                if (request.Leiras != null) patchDoc.Replace(f => f.Leiras, request.Leiras);
                if (request.EredetiNyelv != null) patchDoc.Replace(f => f.EredetiNyelv, request.EredetiNyelv);
                if (request.EredetiCim != null) patchDoc.Replace(f => f.EredetiCim, request.EredetiCim);
                if (request.Szinkron != null) patchDoc.Replace(f => f.Szinkron, request.Szinkron);
                if (request.TrailerLink != null) patchDoc.Replace(f => f.TrailerLink, request.TrailerLink);
                if (request.IMDB != null) patchDoc.Replace(f => f.IMDB, request.IMDB);
                if (request.Megjegyzes != null) patchDoc.Replace(f => f.Megjegyzes, request.Megjegyzes);
                patchDoc.ApplyTo(movie);
                if (request.image != null)
                {
                    var httpClient = httpClientFactory.CreateClient("ImageUpload");
                    httpClient.DefaultRequestHeaders.Add("X-Internal-Request", "True");
                    httpClient.DefaultRequestHeaders.Add("Role", "Admin");
                    using var content = new MultipartFormDataContent();
                    using var fileStream = request.image.OpenReadStream();
                    content.Add(new StreamContent(fileStream), "file", request.image.FileName);
                    var response = await httpClient.PostAsync("api/image/upload", content);
                    if (!response.IsSuccessStatusCode)
                    {
                        var errorContent = await response.Content.ReadAsStringAsync();
                        return new Models.ErrorModel($"Sikertelen fájlfeltöltés: {response.StatusCode} - {errorContent}");
                    }
                    var result = await response.Content.ReadFromJsonAsync<ImageUploadResponse>();
                    if (result == null)
                    {
                        return new Models.ErrorModel("Sikertelen fájlfeldolgozás");
                    }
                    patchDoc.Replace(f => f.ImageID, result.Id);
                }
                else if (request.imageId.HasValue)
                {
                    patchDoc.Replace(f => f.ImageID, request.imageId.Value);
                }
                patchDoc.ApplyTo(movie);

                await context.SaveChangesAsync();
                return new Models.ErrorModel("Sikeres módosítás");
            }
            catch (Exception ex)
            {
                return new Models.ErrorModel(ex.Message);
            }
        }


        public async Task<Models.ErrorModel?> deleteFilm(int id)
        {
            using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                var film = await context.Film
                    .Include(f => f.Vetitesek)
                        .ThenInclude(v => v.VetitesSzekek)
                    .Include(f => f.Vetitesek)
                        .ThenInclude(v => v.Terem)
                    .FirstOrDefaultAsync(f => f.id == id);

                if (film == null)
                {
                    return new Models.ErrorModel("Nem található ilyen id-jű film az adatbázisban");
                }
                var affectedUsers = new Dictionary<int, List<(VetitesSzekek seat, Entities.Vetites.Vetites vetites)>>();
                if(film.Vetitesek.Count > 0)
                {
                    return new ErrorModel("Nem lehet törölni olyan filmet, aminek volt/lesz vetítése");
                }
                foreach (var vetites in film.Vetitesek)
                {
                    if (vetites.Idopont > DateTime.Now)
                    {
                        foreach (var seat in vetites.VetitesSzekek.Where(s => s.FoglalasAllapot == 2))
                        {
                            await TrackAffectedUser(seat, vetites, affectedUsers);
                        }
                    }                       
                }
                context.Film.Remove(film);
                await context.SaveChangesAsync();
                await SendFilmDeletionNotifications(affectedUsers, film.Cim);

                await transaction.CommitAsync();
                return new Models.ErrorModel("Sikeres törlés");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new Models.ErrorModel($"Hiba történt a törlés során: {ex.Message}");
            }
        }

        private async Task TrackAffectedUser(VetitesSzekek seat, Entities.Vetites.Vetites vetites,
            Dictionary<int, List<(VetitesSzekek seat, Entities.Vetites.Vetites vetites)>> affectedUsers)
        {
            var foglaltSzek = await context.FoglaltSzekek
                .Include(fs => fs.FoglalasAdatok)
                    .ThenInclude(fa => fa.User)
                .FirstOrDefaultAsync(fs =>
                    fs.Vetitesid == vetites.id &&
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

        private async Task SendFilmDeletionNotifications(
            Dictionary<int, List<(VetitesSzekek seat, Entities.Vetites.Vetites vetites)>> affectedUsers,
            string filmTitle)
        {
            foreach (var userEntry in affectedUsers)
            {
                var userId = userEntry.Key;
                var user = await context.Users.FindAsync(userId);
                if (user == null || string.IsNullOrEmpty(user.email)) continue;
                var vetitesek = userEntry.Value
                    .GroupBy(x => x.vetites)
                    .Select(g => new {
                        Vetites = g.Key,
                        Seats = g.Select(x => x.seat).ToList()
                    }).ToList();
                var emailBody = new StringBuilder()
                    .AppendLine($"<h2>Tisztelt {user.email}!</h2>")
                    .AppendLine($"<p>A következő foglalásait töröltük, mert a/az <strong>{filmTitle}</strong> című film törlésre került:</p>");
                foreach (var vetites in vetitesek)
                {
                    emailBody.AppendLine($"<h3>{vetites.Vetites.Terem?.Nev ?? "Ismeretlen terem"} - {vetites.Vetites.Idopont:yyyy.MM.dd HH:mm}</h3>")
                            .AppendLine("<p><strong>Érintett székek:</strong></p><ul>");
                    foreach (var seat in vetites.Seats)
                    {
                        emailBody.AppendLine($"<li>{seat.X + 1}. sor, {seat.Y + 1}. szék</li>");
                    }
                    emailBody.AppendLine("</ul>");
                }
                emailBody.AppendLine("<p>Sajnáljuk, hogy a film eltávolításra került. Kérjük, nézze meg a jelenleg elérhető filmjeinket és vetítéseinket.</p>");
                try
                {
                    await emailService.SendEmailAsync(
                        user.email,
                        $"Film törölve - {filmTitle} foglalásai érintve lettek",
                        emailBody.ToString()
                    );
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Hiba történt az email küldésekor: {ex.Message}");
                }
            }
        }        
    }
}
