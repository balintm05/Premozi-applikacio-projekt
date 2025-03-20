using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Entities.Foglalas;
using ReactApp1.Server.Services.Foglalas;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FoglalasController(IFoglalasService foglalasService) : ControllerBase
    {
        [Authorize(Roles ="Admin")]
        [HttpGet("get")]
        public async Task<ActionResult<FoglalasAdatok>?> GetFoglalas()
        {
            var foglalasok = await foglalasService.GetFoglalas();
            return Ok(foglalasok);
        }

    }
}
