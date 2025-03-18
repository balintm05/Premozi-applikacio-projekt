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

namespace ReactApp1.Server.Services
{
    public class MovieService(DataBaseContext context, IConfiguration configuration):IMovieService
    {
        public async Task<List<GetFilmResponse>?> queryMovies(GetFilmQueryFilter request)
        {
            try
            {
                var movies = await context.Film.ToListAsync();
                if (!string.IsNullOrEmpty(request.id) && int.TryParse(request.id, out int r))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => user.id.ToString().Equals(request.id)).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Kategoria))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => user.Kategoria.Contains(request.Kategoria)).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Mufaj))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => user.Mufaj.Contains(request.Mufaj)).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Korhatar))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => user.Korhatar.StartsWith(request.Korhatar)).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Jatekido) && int.TryParse(request.Jatekido, out int j))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => user.Jatekido.ToString().StartsWith(request.Jatekido)).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Gyarto))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => user.Gyarto.Contains(request.Gyarto)).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Rendezo))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => user.Rendezo.Contains(request.Rendezo)).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Szereplok))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => user.Szereplok.Contains(request.Szereplok)).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Leiras))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => user.Leiras.Contains(request.Leiras)).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.EredetiNyelv))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => user.EredetiNyelv.StartsWith(request.EredetiNyelv)).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.EredetiCim))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => user.EredetiCim.StartsWith(request.EredetiCim)).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Szinkron))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => user.Szinkron.StartsWith(request.Szinkron)).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.IMDB))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => user.IMDB.StartsWith(request.IMDB)).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.AlapAr)&& int.TryParse(request.AlapAr, out int a))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => user.AlapAr.ToString().StartsWith(request.AlapAr)).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Megjegyzes))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => user.Megjegyzes.Contains(request.Megjegyzes)).ToListAsync();
                }
                var response = new List<GetFilmResponse>();
                foreach (var movie in movies)
                {
                    response.Add(new GetFilmResponse(movie));
                }
                return response;
            }
            catch(Exception ex) 
            {
                return null;
            }
        }


        public async Task<Models.ErrorModel?> addMovie(ManageFilmDto request)
        {
            try
            {
                var movie = new Film();
                movie.Cim = request.Cim;
                movie.Kategoria = request.Kategoria;
                movie.Mufaj = request.Mufaj;
                movie.Korhatar = request.Korhatar;
                movie.Jatekido = int.TryParse(request.Jatekido, out int res)?res:throw new Exception("Nem számot adott meg");
                movie.Gyarto = request.Gyarto;
                movie.Rendezo = request.Rendezo;
                movie.Szereplok = request.Szereplok;
                movie.Leiras = request.Leiras;
                movie.EredetiNyelv = request.EredetiNyelv;
                movie.EredetiCim = request.EredetiCim;
                movie.Szinkron = request.Szinkron;
                movie.TrailerLink = request.TrailerLink;
                movie.IMDB = request.IMDB;
                movie.AlapAr = int.TryParse(request.AlapAr, out int a) ? a : throw new Exception("Nem számot adott meg");
                movie.Megjegyzes = !string.IsNullOrEmpty(request.Megjegyzes) ? request.Megjegyzes : "";
                await context.Film.AddAsync(movie);
                await context.SaveChangesAsync();
                return new Models.ErrorModel("Sikeres hozzáadás");
            }
            catch (Exception ex) 
            {
                return new Models.ErrorModel(ex.Message);
            }            
        }


        public async Task<Models.ErrorModel?> editMovie(ManageFilmDto request)
        {
            try
            {
                var movie = await context.Film.FindAsync(int.Parse(request.id));
                if (movie == null)
                {
                    throw new Exception("Nem található ilyen id-jű film");
                }
                var patchDoc = new JsonPatchDocument<Film>();
                if (!string.IsNullOrEmpty(request.Cim))
                {
                    patchDoc.Replace(movie => movie.Cim, request.Cim);
                }
                if (!string.IsNullOrEmpty(request.Kategoria))
                {
                    patchDoc.Replace(movie => movie.Kategoria, request.Kategoria);
                }
                if (!string.IsNullOrEmpty(request.Mufaj))
                {
                    patchDoc.Replace(movie => movie.Mufaj, request.Mufaj);
                }
                if (!string.IsNullOrEmpty(request.Korhatar))
                {
                    patchDoc.Replace(movie => movie.Korhatar, request.Korhatar);
                }
                if (!string.IsNullOrEmpty(request.Jatekido))
                {
                    patchDoc.Replace(movie => movie.Jatekido, int.TryParse(request.Jatekido, out int res) ? res : throw new Exception("Nem számot adott meg"));
                }

                if (!string.IsNullOrEmpty(request.Gyarto))
                {
                    patchDoc.Replace(movie => movie.Gyarto, request.Gyarto);
                }
                if (!string.IsNullOrEmpty(request.Rendezo))
                {
                    patchDoc.Replace(movie => movie.Rendezo, request.Rendezo);
                }
                if (!string.IsNullOrEmpty(request.Szereplok))
                {
                    patchDoc.Replace(movie => movie.Szereplok, request.Szereplok);
                }
                if (!string.IsNullOrEmpty(request.Leiras))
                {
                    patchDoc.Replace(movie => movie.Leiras, request.Leiras);

                }
                if (!string.IsNullOrEmpty(request.EredetiNyelv))
                {
                    patchDoc.Replace(movie => movie.EredetiNyelv, request.EredetiNyelv);
                }
                if (!string.IsNullOrEmpty(request.EredetiCim))
                {
                    patchDoc.Replace(movie => movie.EredetiCim, request.EredetiCim);
                }
                if (!string.IsNullOrEmpty(request.Szinkron))
                {
                    patchDoc.Replace(movie => movie.Szinkron, request.Szinkron);
                }
                if (!string.IsNullOrEmpty(request.TrailerLink))
                {
                    patchDoc.Replace(movie => movie.TrailerLink, request.TrailerLink);

                }
                if (!string.IsNullOrEmpty(request.IMDB))
                {
                    patchDoc.Replace(movie => movie.IMDB, request.IMDB);
                }
                if (!string.IsNullOrEmpty(request.AlapAr))
                {
                    patchDoc.Replace(movie => movie.AlapAr, int.TryParse(request.AlapAr, out int a) ? a : throw new Exception("Nem számot adott meg"));
                }
                if (!string.IsNullOrEmpty(request.Megjegyzes))
                {
                    patchDoc.Replace(movie => movie.Megjegyzes, request.Megjegyzes);
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


        public async Task<Models.ErrorModel?> deleteMovie(int id)
        {
            try
            {
                context.Film.Remove(await context.Film.FindAsync(id));
                await context.SaveChangesAsync();
                return new Models.ErrorModel("Sikeres törlés");
            }
            catch(IndexOutOfRangeException ex)
            {
                return new Models.ErrorModel("Nincs ilyen id-jű film");
            }
            catch(Exception ex)
            {
                return new Models.ErrorModel(ex.Message);
            }
            
        }
    }
}
