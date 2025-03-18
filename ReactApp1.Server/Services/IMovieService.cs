using ReactApp1.Server.Entities;
using ReactApp1.Server.Models.Film;
using ReactApp1.Server.Models.Film.ManageFilm;

namespace ReactApp1.Server.Services
{
    public interface IMovieService
    {
        Task<List<GetFilmResponse>?> queryMovies(GetFilmQueryFilter request);
        Task<Models.ErrorModel?> addMovie(ManageFilmDto request);
        Task<Models.ErrorModel?> editMovie(ManageFilmDto request);
        Task<Models.ErrorModel?> deleteMovie(int id);
    }
}
