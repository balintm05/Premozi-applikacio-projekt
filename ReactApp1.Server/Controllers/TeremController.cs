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
using ReactApp1.Server.Models.Terem;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeremController(ITeremService teremService) : Controller
    {
        [AllowAnonymous]
        [HttpGet("getTerem")]
        public async Task<ActionResult<List<GetTeremResponse>?>> GetTerem()
        {
            return await teremService.getTerem();
        }
        [AllowAnonymous]
        [HttpGet("getTerem/{id}")]
        public async Task<ActionResult<GetTeremResponse?>> GetTerem(int id)
        {
            var err = await teremService.getTerem(id);
            if(err.error != null)
            {
                return BadRequest(err);
            }
            return Ok(err);
        }
        //[Authorize(Roles ="Admin")]
        [HttpPost("addTerem")]
        public async Task<ActionResult<Models.ErrorModel?>> AddTerem(ManageTeremDto request)
        {
            var err = await teremService.addTerem(request);
            if (err.errorMessage == "Sikeres hozzáadás")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }
        //[Authorize(Roles = "Admin")]
        [HttpPatch("editTerem")]
        public async Task<ActionResult<Models.ErrorModel?>> EditTerem(ManageTeremDto request)
        {
            var err = await teremService.editTerem(request);
            if (err.errorMessage == "Sikeres módosítás")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }
        //[Authorize(Roles ="Admin")]
        [HttpDelete("deleteTerem/{id}")]
        public async Task<ActionResult<Models.ErrorModel?>> deleteTerem(int id)
        {
            var err = await teremService.deleteTerem(id);
            if (err.errorMessage == "Sikeres törlés")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }
    }
}
