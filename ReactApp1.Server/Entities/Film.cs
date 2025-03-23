using ReactApp1.Server.Entities.Foglalas;
using ReactApp1.Server.Entities.Vetites;
using ReactApp1.Server.Models.Film.ManageFilm;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography;
using System.Text;

namespace ReactApp1.Server.Entities
{
    public class Film
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Required]
        public string Cim { get; set; }

        [Required]
        public string Kategoria { get; set; }

        [Required]
        public string Mufaj { get; set; }

        [Required]
        public string Korhatar { get; set; }

        [Required]
        public int Jatekido { get; set; }

        [Required]
        public string Gyarto { get; set; }

        [Required]
        public string Rendezo { get; set; }

        [Required]
        public string Szereplok { get; set; }

        [Required]
        public string Leiras { get; set; }

        [Required]
        public string EredetiNyelv { get; set; }

        [Required]
        public string EredetiCim { get; set; }

        [Required]
        public string Szinkron { get; set; }

        [Required]
        public string TrailerLink { get; set; }

        [Required]
        public string IMDB { get; set; }

        public string Megjegyzes { get; set; } = "";

        public ICollection<Vetites.Vetites> Vetitesek { get; set; } = new List<Vetites.Vetites>();
    }
}
