using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Entities.Foglalas;
using ReactApp1.Server.Services.Foglalas;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class FoglalasController(IFoglalasService foglalasService) : ControllerBase
    {
        //[Authorize(Roles ="Admin")]
        [HttpGet("get")]
        public async Task<ActionResult<List<FoglalasAdatok>>?> GetFoglalas()
        {
            var foglalasok = await foglalasService.GetFoglalas();
            return Ok(foglalasok);
        }
        [HttpGet("getByVetites/{vid}")]
        public async Task<ActionResult<List<FoglalasAdatok>>?> GetFoglalasByVetites(int vid)
        {
            var foglalasok = await foglalasService.GetFoglalasByVetites(vid);
            if (foglalasok == null)
            {
                return BadRequest("Nem található foglalás ezzel a vetítés id-vel");
            }
            return Ok(foglalasok);
        }
        [HttpGet("getByUser/{uid}")]
        public async Task<ActionResult<List<FoglalasAdatok>>?> GetFoglalasByUser(int uid)
        {
            var foglalasok = await foglalasService.GetFoglalasByVetites(uid);
            if (foglalasok == null)
            {
                return BadRequest("Nem található foglalás ezzel a felhasználó id-vel");
            }
            return Ok(foglalasok);
        }

    }
}
