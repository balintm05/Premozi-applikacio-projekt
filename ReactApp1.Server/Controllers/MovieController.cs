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
using ReactApp1.Server.Services;
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

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController(IMovieService movieService) : Controller
    {
        [Authorize(Roles = "Admin")]
        [HttpPost("queryMovies")]
        public async Task<ActionResult<dynamic>> QueryMovies(GetFilmQueryFilter request) 
        {
            var movies = await movieService.queryMovies(request);
            if (movies == null)
            {
                return BadRequest(new Models.ErrorModel("Hiba történt"));
            }
            return Ok( await movieService.queryMovies(request));
        }


        [AllowAnonymous]
        [HttpGet("getMovies")]
        public async Task<ActionResult<List<GetFilmResponse>?>> getMovies()
        {
            return await movieService.getMovies();
        }


        //[Authorize(Roles = "Admin")]
        [HttpPost("addMovie")]
        public async Task<ActionResult<Models.ErrorModel?>> AddMovie(ManageFilmDto request)
        {
            var err = await movieService.addMovie(request);
            if (err.errorMessage == "Sikeres hozzáadás")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }


        //[Authorize(Roles = "Admin")]
        [HttpPatch("editMovie")]
        public async Task<ActionResult<Models.ErrorModel?>> EditMovie(ManageFilmDto request)
        {
            var err = await movieService.editMovie(request);
            if (err.errorMessage == "Sikeres módosítás")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }


        //[Authorize(Roles = "Admin")]
        [HttpDelete("deleteMovie/{id}")]
        public async Task<ActionResult<Models.ErrorModel?>> DeleteMovie(int id)
        {
            var err = await movieService.deleteMovie(id);
            if (err.errorMessage == "Sikeres törlés")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }
    }
}
