using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ReactApp1.Server.Models.Film.ManageFilm;
using ReactApp1.Server.Models.Film;
using ReactApp1.Server.Services.Film;
using ReactApp1.Server.Models;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilmController(IFilmService filmService) : Controller
    {
        [AllowAnonymous]
        [HttpPost("query")]
        public async Task<ActionResult> QueryFilm(GetFilmQueryFilter request) 
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
        public async Task<ActionResult> GetFilm()
        {
            return Ok(await filmService.getFilm());
        }
        [AllowAnonymous]
        [HttpGet("get/{id}")]
        public async Task<ActionResult> GetFilm(int id)
        {
            var film = await filmService.getFilm(id);
            if (film == null)
            {
                return BadRequest(new ErrorModel("A film nem található"));
            }
            return Ok(film);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("add")]
        public async Task<ActionResult<Models.ErrorModel?>> AddFilm(ManageFilmDto request)
        {
            var err = await filmService.addFilm(request, HttpContext);
            if (err.errorMessage == "Sikeres hozzáadás")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }


        [Authorize(Roles = "Admin")]
        [HttpPatch("edit")]
        public async Task<ActionResult<Models.ErrorModel?>> EditFilm(ManageFilmDto request)
        {
            var err = await filmService.editFilm(request, HttpContext);
            if (err.errorMessage == "Sikeres módosítás")
            {
                return Ok(err);
            }
            return BadRequest(err);
        }


        [Authorize(Roles = "Admin")]
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
