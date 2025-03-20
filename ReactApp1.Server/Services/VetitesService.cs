using ReactApp1.Server.Data;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models.Terem;
using ReactApp1.Server.Models.Vetites;
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

namespace ReactApp1.Server.Services
{
    public class VetitesService(DataBaseContext context, IConfiguration configuration) : IVetitesService
    {
        public async Task<List<GetVetitesResponse>?> getVetites()
        {
            var vetitesek = await context.Vetites.ToListAsync();
            var vetitesszekek = await context.VetitesSzekek.ToListAsync();
            var response = new List<GetVetitesResponse>();
            foreach(var vetites in vetitesek)
            {
                response.Add(new GetVetitesResponse(vetites));
            }
            return response;
        }
        public async Task<GetVetitesResponse?> getVetites(int id)
        {
            var vetites = await context.Vetites.FindAsync(id);
            var szekek = await context.VetitesSzekek.ToAsyncEnumerable().WhereAwait(async x => x.Vetitesid == id).ToListAsync();
            if (vetites == null)
            {
                return new GetVetitesResponse("Nincs ilyen id-jű vetítés az adatbázisban");
            }
            return new GetVetitesResponse(vetites);
        }
        public async Task<ErrorModel> addVetites(ManageVetitesDto request)
        {            
            var vetites = new Entities.Vetites.Vetites();
            var vetitesszekek = new List<Entities.Vetites.VetitesSzekek>();
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
            var terem = await context.Terem.ToAsyncEnumerable().WhereAwait(async x => x.id == tid).ToListAsync();
            var film = await context.Film.ToAsyncEnumerable().WhereAwait(async x => x.id == fid).ToListAsync();
            if (terem == null)
            {
                return new ErrorModel("Nem található ilyen id-jű terem az adatbázisban");
            }
            if(film == null)
            {
                return new ErrorModel("Nem található ilyen id-jű film az adatbázisban");
            }
            Console.WriteLine("{0}, {1}, {2}", fid, tid, ido);
            vetites.Filmid = fid;
            vetites.Teremid = tid;
            vetites.Idopont = ido;
            await context.Vetites.AddAsync(vetites);
            await CreateVSzekek(vetites);
            await context.SaveChangesAsync();
            return new Models.ErrorModel("Sikeres hozzáadás");
        }
        private async Task CreateVSzekek(Entities.Vetites.Vetites vetites)
        {
            var vszekek = new List<Entities.Vetites.VetitesSzekek>();
            var szekek = await context.Szekek.ToAsyncEnumerable().WhereAwait(async x => x.Teremid == vetites.Teremid).ToListAsync();
            var sorok = szekek.Where(x => x.X == 0).Count();
            var oszlopok = szekek.Where(x => x.Y == 0).Count();
            Console.WriteLine("{0}, {1}", sorok, oszlopok);
            for (int x = 0; x < sorok; x++)
            {
                for (int y = 0; y < oszlopok; y++)
                {
                    var t = new Entities.Vetites.VetitesSzekek { Vetites = vetites, Szekek = szekek[x * oszlopok + y]};                   
                    vszekek.Add(t);
                }
            }
            foreach (var szek in vszekek)
            {
                await context.VetitesSzekek.AddAsync(szek);
            }
        }
        private async Task DeleteExistingVSzekek(Entities.Vetites.Vetites vetites)
        {
            var szekek = await context.VetitesSzekek.ToAsyncEnumerable().WhereAwait(async x => x.Vetitesid == vetites.id).ToListAsync();
            context.RemoveRange(szekek);
            await context.SaveChangesAsync();
        }
    }
}
