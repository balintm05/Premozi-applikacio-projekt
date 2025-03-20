using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Entities;
using System.Text;
using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using System.Web;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.JsonPatch;
using ReactApp1.Server.Models.JWT;
using ReactApp1.Server.Models.User;
using ReactApp1.Server.Models.User.EditUser;
using System.Net.Http;
using System.Net.Http.Headers;
using Renci.SshNet.Messages;
using Humanizer;
using NuGet.Protocol;
using NuGet.Common;
using System.Net.Http.Formatting;
using Microsoft.DotNet.MSIdentity.Shared;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Net;
using ReactApp1.Server.Models.User.Response;
using Org.BouncyCastle.Ocsp;
using ReactApp1.Server.Models.Film.ManageFilm;
using ReactApp1.Server.Models.Film;
using Org.BouncyCastle.Asn1.Mozilla;
using ReactApp1.Server.Services.Film;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilmController(IFilmService filmService) : Controller
    {
        [Authorize(Roles = "Admin")]
        [HttpPost("query")]
        public async Task<ActionResult<dynamic>> QueryFilm(GetFilmQueryFilter request) 
        {
            var movies = await filmService.queryFilm(request);
            if (movies == null)
            {
                return BadRequest(new Models.ErrorModel("Hiba történt"));
            }
            return Ok( await filmService.queryFilm(request));
        }


        [AllowAnonymous]
        [HttpGet("get")]
        public async Task<ActionResult<List<GetFilmResponse>?>> GetFilm()
        {
            return await filmService.getFilm();
        }
        [AllowAnonymous]
        [HttpGet("get/{id}")]
        public async Task<ActionResult<GetFilmResponse?>> GetFilm(int id)
        {
            var err = await filmService.getFilm(id);
            if (err.Error!=null)
            {
                return BadRequest(err);
            }
            return Ok(err);
        }

        //[Authorize(Roles = "Admin")]
        [HttpPost("add")]
        public async Task<ActionResult<Models.ErrorModel?>> AddFilm(ManageFilmDto request)
        {
            var err = await filmService.addFilm(request);
            if (err.errorMessage == "Sikeres hozzáadás")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }


        //[Authorize(Roles = "Admin")]
        [HttpPatch("edit")]
        public async Task<ActionResult<Models.ErrorModel?>> EditFilm(ManageFilmDto request)
        {
            var err = await filmService.editFilm(request);
            if (err.errorMessage == "Sikeres módosítás")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }


        //[Authorize(Roles = "Admin")]
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<Models.ErrorModel?>> DeleteFilm(int id)
        {
            var err = await filmService.deleteFilm(id);
            if (err.errorMessage == "Sikeres törlés")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }
    }
}
