using ReactApp1.Server.Entities;
using ReactApp1.Server.Models.Film;
using ReactApp1.Server.Models.Film.ManageFilm;

namespace ReactApp1.Server.Services
{
    public interface IMovieService
    {
        Task<List<GetFilmDto>?> getMovies();
        Task<Models.ErrorModel?> addMovie(AddFilmDto request);
    }
}
