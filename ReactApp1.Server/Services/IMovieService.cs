using ReactApp1.Server.Entities;

namespace ReactApp1.Server.Services
{
    public interface IMovieService
    {
        Task<List<Film>> getMovies();
    }
}
