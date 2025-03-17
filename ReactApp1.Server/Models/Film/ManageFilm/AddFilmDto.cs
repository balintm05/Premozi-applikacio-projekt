namespace ReactApp1.Server.Models.Film.ManageFilm
{
    public class AddFilmDto
    {
        public required string Cim { get; set; }
        public required string Kategoria { get; set; }
        public required string Mufaj { get; set; }
        public required string Korhatar { get; set; }
        public required int Jatekido { get; set; }
        public required string Gyarto { get; set; }
        public required string Rendezo { get; set; }
        public required string Szereplok { get; set; }
        public required string Leiras { get; set; }
        public required string EredetiNyelv { get; set; }
        public required string EredetiCim { get; set; }
        public required string Szinkron { get; set; }
        public required string TrailerLink { get; set; }
        public required string IMDB { get; set; }
        public required int AlapAr { get; set; }
        public string? Megjegyzes { get; set; }
        public ErrorModel? Error { get; set; }
    }
}
