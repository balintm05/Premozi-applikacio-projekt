using ReactApp1.Server.Data;
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
using ReactApp1.Server.Models.Terem;

namespace ReactApp1.Server.Services
{
    public class TeremService(DataBaseContext context, IConfiguration configuration):ITeremService
    {
        public async Task<List<GetTeremResponse>?> getTerem()
        {
            var termek = await context.Terem.ToListAsync();
            var szekek = await context.Szekek.ToListAsync();
            var response = new List<GetTeremResponse>();           
            foreach (var terem in termek)
            {
                response.Add(new GetTeremResponse(terem));
            }
            return response;
        }
        public async Task<Models.ErrorModel?> addTerem(ManageTeremDto request)
        {
            try
            {
                var terem = new Terem();
                var szekek = new List<Szekek>();
                terem.Nev = request.Nev;
                bool s = int.TryParse(request.Sorok, out int sorok);
                bool o = int.TryParse(request.Oszlopok, out int oszlopok);
                if (s && o)
                {
                    await context.AddAsync(terem);
                    CreateSzekek(sorok, oszlopok, terem);
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
            var terem = await context.Terem.FindAsync(int.Parse(request.id));
            if (terem == null)
            {
                return new Models.ErrorModel("Nem található ilyen id-jű terem az adatbázisban");
            }
            var patchDoc = new JsonPatchDocument<Terem>();
            if (!string.IsNullOrEmpty(request.Nev))
            {
                patchDoc.Replace(terem => terem.Nev, request.Nev);
            }
            patchDoc.ApplyTo(terem);
            await context.AddAsync(terem);
            int.TryParse(request.Sorok, out int s);
            int.TryParse(request.Oszlopok, out int o);           
            if (s != terem.Szekek.Where(x=> x.X == 0).Count() || o != terem.Szekek.Where(x => x.Y == 0).Count())
            {
                DeleteExistingSzekek(terem);
                CreateSzekek(s, o, terem);
            }
            await context.SaveChangesAsync();
            return new Models.ErrorModel("Sikeres módosítás");
        }
        public async Task<Models.ErrorModel?> deleteTerem(int id)
        {
            return null;
        }
        private async void CreateSzekek(int sorok, int oszlopok, Terem terem)
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
                await context.AddAsync(szek);
            }
        }
        private async void DeleteExistingSzekek(Terem terem)
        {
            var szekek = await context.Terem.FindAsync(terem.id);
            context.Remove(szekek);
        }
    }
}
