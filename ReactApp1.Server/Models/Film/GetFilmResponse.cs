using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography;
using System.Text;

namespace ReactApp1.Server.Models.Film
{
    public class GetFilmResponse
    {
        public string? id { get; set; }
        public string? Cim { get; set; }
        public string? Kategoria { get; set; }
        public string? Mufaj { get; set; }
        public string? Korhatar { get; set; }
        public string? Jatekido { get; set; }
        public string? Gyarto { get; set; }
        public string? Rendezo { get; set; }
        public string? Szereplok { get; set; }
        public string? Leiras { get; set; }
        public string? EredetiNyelv { get; set; }
        public string? EredetiCim { get; set; }
        public string? Szinkron { get; set; }
        public string? IMDB { get; set; }
        public string? Megjegyzes { get; set; }
        public string? TrailerLink { get; set; }
        public string? ImageID { get; set; }
        public ErrorModel? Error { get; set; }
        public GetFilmResponse(Entities.Film film)
        {
            id = film.id.ToString();
            Cim = film.Cim;
            Kategoria = film.Kategoria;
            Mufaj = film.Mufaj;
            Korhatar = film.Korhatar;
            Jatekido = film.Jatekido.ToString();
            Gyarto = film.Gyarto;
            Rendezo = film.Rendezo;
            Szereplok = film.Szereplok;
            Leiras = film.Leiras;
            EredetiNyelv = film.EredetiNyelv;
            EredetiCim = film.EredetiCim;
            Szinkron = film.Szinkron;
            TrailerLink = film.TrailerLink;
            ImageID= film.ImageID.ToString();
            IMDB = film.IMDB;
            Megjegyzes = film.Megjegyzes;
        }
        public GetFilmResponse(string err)
        {
            Error = new ErrorModel(err);
        }
    }
}
