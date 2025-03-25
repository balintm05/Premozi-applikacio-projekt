namespace ReactApp1.Server.Models.Film.ManageFilm
{
    public class ManageFilmDto
    {
        public string? id { get; set; }
        public string?  Cim { get; set; }
        public string?  Kategoria { get; set; }
        public string?  Mufaj { get; set; }
        public string?  Korhatar { get; set; }
        public string?  Jatekido { get; set; }
        public string?  Gyarto { get; set; }
        public string?  Rendezo { get; set; }
        public string?  Szereplok { get; set; }
        public string?  Leiras { get; set; }
        public string?  EredetiNyelv { get; set; }
        public string?  EredetiCim { get; set; }
        public string?  Szinkron { get; set; }
        public string?  TrailerLink { get; set; }
        public IFormFile? image { get; set; }
        public string?  IMDB { get; set; }
        public string? Megjegyzes { get; set; }
    }
}
