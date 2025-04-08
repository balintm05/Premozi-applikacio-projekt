using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ReactApp1.Server.Models.Vetites;
using ReactApp1.Server.Models;
using ReactApp1.Server.Services.Vetites;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VetitesController(IVetitesService vetitesService) : ControllerBase
    {

        [AllowAnonymous]
        [HttpGet("get")]
        public async Task<ActionResult<List<Models.Vetites.GetVetitesResponse>?>> GetVetites()
        {
            return await vetitesService.getVetites();
        }
        [AllowAnonymous]
        [HttpGet("get/{id}")]
        public async Task<ActionResult<List<Models.Vetites.GetVetitesResponse>?>> GetVetites(int id)
        {
            var err = await vetitesService.getVetites(id);
            if (err.Error != null)
            {
                return BadRequest(err);
            }
            return Ok(err);
        }
        [Authorize(Roles ="Admin")]
        [HttpPost("add")]
        public async Task<ActionResult<List<ErrorModel>?>> AddVetites(ManageVetitesDto request)
        {
            var err = await vetitesService.addVetites(request);
            if (err.errorMessage=="Sikeres hozzáadás")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }
        [Authorize(Roles ="Admin")]
        [HttpPatch("edit")]
        public async Task<ActionResult<ErrorModel>?> EditVetites(ManageVetitesDto request)
        {
            var err = await vetitesService.editVetites(request);
            if (err.errorMessage == "Sikeres módosítás")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }
        [Authorize(Roles ="Admin")]
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<ErrorModel>?> DeleteVetites(int id)
        {
            var err = await vetitesService.deleteVetites(id);
            if (err.errorMessage == "Sikeres törlés")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }
    }
}
