﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Entities.Foglalas;
using ReactApp1.Server.Models.Foglalas;
using ReactApp1.Server.Models.Rendeles;
using ReactApp1.Server.Services.Foglalas;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoglalasController(IFoglalasService foglalasService) : ControllerBase
    {
        [AllowAnonymous]
        [HttpGet("getJegyTipus")]
        public async Task<ActionResult<List<JegyTipus>>> GetJegyTipus()
        {
            return await foglalasService.getJegyTipusok();
        }
        [Authorize(Roles ="Admin")]
        [HttpGet("get")]
        public async Task<ActionResult<List<GetFoglalasResponse>>?> GetFoglalas()
        {
            var foglalasok = await foglalasService.GetFoglalas();
            return Ok(foglalasok);
        }
        [Authorize]
        [HttpGet("getByVetites/{vid}")]
        public async Task<ActionResult<List<GetFoglalasResponse>>?> GetFoglalasByVetites(int vid)
        {
            var foglalasok = await foglalasService.GetFoglalasByVetites(vid);
            if (foglalasok == null)
            {
                return BadRequest("Nem található foglalás ezzel a vetítés id-vel");
            }
            return Ok(foglalasok);
        }
        [Authorize]
        [HttpGet("getByUser/{uid}")]
        public async Task<ActionResult<List<GetFoglalasResponse>>?> GetFoglalasByUser(int uid)
        {
            var foglalasok = await foglalasService.GetFoglalasByUser(uid);
            if (foglalasok == null)
            {
                return BadRequest("Nem található foglalás ezzel a felhasználó id-vel");
            }
            return Ok(foglalasok);
        }
        [Authorize]
        [HttpPost("add")]
        public async Task<ActionResult<Models.ErrorModel?>> AddFoglalas(ManageFoglalasDto request)
        {
            var err = await foglalasService.addFoglalas(request);
            if (err.errorMessage == "Sikeres hozzáadás")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }
        [Authorize]
        [HttpPatch("edit")]
        public async Task<ActionResult<Models.ErrorModel?>> EditFoglalas(ManageFoglalasDto request)
        {
            var err = await foglalasService.editFoglalas(request);
            if (err.errorMessage == "Sikeres módosítás")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }
        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<Models.ErrorModel?>> DeleteFoglalas(int id)
        {
            var err = await foglalasService.deleteFoglalas(id);
            if (err.errorMessage == "Sikeres törlés")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }
    }
}
