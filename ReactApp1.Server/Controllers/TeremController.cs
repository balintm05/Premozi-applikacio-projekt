using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Services;
using Microsoft.AspNetCore.Authorization;
using ReactApp1.Server.Models.Terem;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeremController(ITeremService teremService) : Controller
    {
        [AllowAnonymous]
        [HttpGet("get")]
        public async Task<ActionResult<List<GetTeremResponse>?>> GetTerem()
        {
            return await teremService.getTerem();
        }
        [AllowAnonymous]
        [HttpGet("get/{id}")]
        public async Task<ActionResult<GetTeremResponse?>> GetTerem(int id)
        {
            var err = await teremService.getTerem(id);
            if(err.error != null)
            {
                return BadRequest(err);
            }
            return Ok(err);
        }
        [Authorize(Roles ="Admin")]
        [HttpPost("add")]
        public async Task<ActionResult<Models.ErrorModel?>> AddTerem(ManageTeremDto request)
        {
            var err = await teremService.addTerem(request);
            if (err.errorMessage == "Sikeres hozzáadás")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }
        [Authorize(Roles = "Admin")]
        [HttpPatch("edit")]
        public async Task<ActionResult<Models.ErrorModel?>> EditTerem(ManageTeremDto request)
        {
            var err = await teremService.editTerem(request);
            if (err.errorMessage == "Sikeres módosítás")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }
        [Authorize(Roles ="Admin")]
        [HttpDelete("delete/{id}")]
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
