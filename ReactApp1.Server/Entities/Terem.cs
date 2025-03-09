using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography;
using System.Text;

namespace ReactApp1.Server.Entities
{
    public class Terem
    {
        [Key, Column(TypeName = "int(5)"), DatabaseGenerated(DatabaseGeneratedOption.Identity), NotNull, Required, Editable(false)]
        public int id { get; set; }
        [Column(TypeName = "int(3)"), NotNull, Required, DataType(DataType.Custom, ErrorMessage = "Kötelező férőhelyet megadni")]
        public int Ferohely { get; set; }
        [Column(TypeName = "text"), NotNull, Required, DataType(DataType.Text, ErrorMessage = "Kötelező típust megadni")]
        public string Tipus { get; set; }
        [Column(TypeName = "int(3)"), NotNull, Required, DataType(DataType.Custom, ErrorMessage = "Kötelező a sorok mennyiségét megadni")]
        public int Sorok { get; set; }
        [Column(TypeName = "longtext"), NotNull, Required, DataType(DataType.Text, ErrorMessage = "Kötelező az állapotot megadni")]
        public string Allapot { get; set; } = "Működik";
        [Column(TypeName = "longtext"), NotNull, DataType(DataType.Text, ErrorMessage = "Hiba történt a megjegyzés hozzáadása során")]
        public string Megjegyzes { get; set; } = "Nincs megjegyzés";
    }
}