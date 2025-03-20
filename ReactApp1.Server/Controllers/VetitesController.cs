using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Services;
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
using ReactApp1.Server.Models.Vetites;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VetitesController(IVetitesService vetitesService) : ControllerBase
    {

        [AllowAnonymous]
        [HttpGet("getVetites")]
        public async Task<ActionResult<List<Models.Vetites.GetVetitesResponse>?>> GetVetites()
        {
            return await vetitesService.getVetites();
        }
        [AllowAnonymous]
        [HttpGet("getVetites/{id}")]
        public async Task<ActionResult<List<Models.Vetites.GetVetitesResponse>?>> GetVetites(int id)
        {
            var err = await vetitesService.getVetites(id);
            if (err != null)
            {
                return BadRequest(err);
            }
            return Ok(err);
        }
        //[Authorize(Roles ="Admin")]
        [HttpPost("addVetites")]
        public async Task<ActionResult<List<Models.Vetites.GetVetitesResponse>?>> AddVetites(ManageVetitesDto request)
        {
            var err = await vetitesService.addVetites(request);
            if (err != null)
            {
                return BadRequest(err);
            }
            return Ok(err);
        }
    }
}
