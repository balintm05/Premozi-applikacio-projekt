using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography;
using System.Text;

namespace ReactApp1.Server.Models.Film
{
    public class FilmDto
    {
        [Key, Column(TypeName = "int(11)"), DatabaseGenerated(DatabaseGeneratedOption.Identity), NotNull, Required, Editable(false)]
        public int? id { get; set; }
        [Required, NotNull, Column(TypeName = "TEXT"), DataType(DataType.Text, ErrorMessage = "Kötelező címet megadni")]
        public string? Cim { get; set; }
        [Required, NotNull, Column(TypeName = "TEXT"), DataType(DataType.Text, ErrorMessage = "Kötelező kategóriát megadni")]
        public string? Kategoria { get; set; }
        [Required, NotNull, Column(TypeName = "TEXT"), DataType(DataType.Text, ErrorMessage = "Kötelező műfajt megadni")]
        public string? Mufaj { get; set; }
        [Required, NotNull, Column(TypeName = "TEXT"), DataType(DataType.Text, ErrorMessage = "Kötelező korhatárt megadni")]
        public string? Korhatar { get; set; }
        [Required, NotNull, Column(TypeName = "INT(4)"), Length(1, 4, ErrorMessage = "Kötelező játékidőt megadni")]
        public int? Jatekido { get; set; }
        [Required, NotNull, Column(TypeName = "TEXT"), DataType(DataType.Text, ErrorMessage = "Kötelező gyártót megadni")]
        public string? Gyarto { get; set; }
        [Required, NotNull, Column(TypeName = "TEXT"), DataType(DataType.Text, ErrorMessage = "Kötelező rendezőt megadni")]
        public string? Rendezo { get; set; }
        [Required, NotNull, Column(TypeName = "TEXT"), DataType(DataType.Text, ErrorMessage = "Kötelező szereplőket megadni")]
        public string? Szereplok { get; set; }
        [Required, NotNull, Column(TypeName = "TEXT"), DataType(DataType.Text, ErrorMessage = "Kötelező leírást megadni")]
        public string? Leiras { get; set; }
        [Required, NotNull, Column(TypeName = "TEXT"), DataType(DataType.Text, ErrorMessage = "Kötelező eredeti nyelvet megadni")]
        public string? Eredeti_nyelv { get; set; }
        [Required, NotNull, Column(TypeName = "TEXT"), DataType(DataType.Text, ErrorMessage = "Kötelező eredeti címet megadni")]
        public string? Eredeti_cim { get; set; }
        [Required, NotNull, Column(TypeName = "TEXT"), DataType(DataType.Text, ErrorMessage = "Kötelező szinkront megadni")]
        public string? Szinkron { get; set; }
        [Required, NotNull, Column(TypeName = "TEXT"), DataType(DataType.Text, ErrorMessage = "Kötelező trailer linket megadni")]
        public string? TrailerLink { get; set; }
        [Required, NotNull, Column(TypeName = "TEXT"), DataType(DataType.Text, ErrorMessage = "Kötelező IMDB értékelést megadni")]
        public string? IMDB { get; set; }
        [Required, NotNull, Column(TypeName = "INT(11)"), DataType(DataType.Currency, ErrorMessage = "Kötelező árat megadni")]
        public int? AlapAr { get; set; }
        [Column(TypeName = "longtext"), NotNull, DataType(DataType.Text, ErrorMessage = "Hiba történt a megjegyzés hozzáadása során")]
        public string? Megjegyzes { get; set; } = "Nincs megjegyzés";
        public ErrorModel? Error { get; set; }
    }
}
