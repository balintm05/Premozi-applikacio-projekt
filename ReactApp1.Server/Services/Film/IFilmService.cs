using ReactApp1.Server.Entities;
using ReactApp1.Server.Models.Film;
using ReactApp1.Server.Models.Film.ManageFilm;

namespace ReactApp1.Server.Services.Film
{
    public interface IFilmService
    {
        Task<List<GetFilmResponse>?> queryFilm(GetFilmQueryFilter request);
        Task<List<GetFilmResponse>?> getFilm();
        Task<GetFilmResponse?> getFilm(int id);
        Task<Models.ErrorModel?> addFilm(ManageFilmDto request, HttpContext httpContext);
        Task<Models.ErrorModel?> editFilm(ManageFilmDto request, HttpContext httpContext);
        Task<Models.ErrorModel?> deleteFilm(int id);
    }
}
