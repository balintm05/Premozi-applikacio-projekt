﻿using ReactApp1.Server.Data;
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

namespace ReactApp1.Server.Services.Film
{
    public class FilmService(DataBaseContext context, IConfiguration configuration):IFilmService
    {
        public async Task<List<GetFilmResponse>?> queryFilm(GetFilmQueryFilter request)
        {
            try
            {
                var movies = await context.Film.ToListAsync();
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
                if (!string.IsNullOrEmpty(request.AlapAr)&& int.TryParse(request.AlapAr, out int a))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => await ValueTask.FromResult(user.AlapAr.ToString().StartsWith(request.AlapAr))).ToListAsync();
                }
                if (!string.IsNullOrEmpty(request.Megjegyzes))
                {
                    movies = await movies.ToAsyncEnumerable().WhereAwait(async user => await ValueTask.FromResult(user.Megjegyzes.ToLower().Contains(request.Megjegyzes.ToLower()))).ToListAsync();
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


        public async Task<List<GetFilmResponse>?> getFilm()
        {
            var filmek = await context.Film.ToListAsync();
            var response = new List<GetFilmResponse>();
            foreach(Entities.Film film in filmek)
            {
                response.Add(new GetFilmResponse(film));
            }
            return response;
        }
        public async Task<GetFilmResponse?> getFilm(int id)
        {
            var film = await context.Film.FindAsync(id);
            if (film == null)
            {
                return new GetFilmResponse("Nincs ilyen id-jű film az adatbázisban");
            }
            return new GetFilmResponse(film);
        }
       

    public async Task<Models.ErrorModel?> addFilm(ManageFilmDto request)
        {
            try
            {
                var movie = new Entities.Film();
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


        public async Task<Models.ErrorModel?> editFilm(ManageFilmDto request)
        {
            try
            {
                var movie = await context.Film.FindAsync(int.Parse(request.id));
                if (movie == null)
                {
                    throw new Exception("Nem található ilyen id-jű film");
                }
                var patchDoc = new JsonPatchDocument<Entities.Film>();
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


        public async Task<Models.ErrorModel?> deleteFilm(int id)
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
