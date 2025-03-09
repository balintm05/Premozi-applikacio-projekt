using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography;
using System.Text;

namespace ReactApp1.Server.Entities
{
    public class Rendeles
    {
        [Key, Column(TypeName = "int(11)"), DatabaseGenerated(DatabaseGeneratedOption.Identity), NotNull, Required, Editable(false)]
        public int id { get; set; }
        [Column(TypeName = "text"), NotNull, Required, DataType(DataType.Text, ErrorMessage = "Váratlan hiba történt (hely)")]
        public int Hely { get; set; }
        [Column(TypeName = "int(1)"), NotNull, Required, DataType(DataType.Text, ErrorMessage = "Váratlan hiba történt (státusz)")]
        public int Statusz { get; set; } = 1;
        [Column(TypeName = "longtext"), NotNull, DataType(DataType.Text, ErrorMessage = "Hiba történt a megjegyzés hozzáadása során")]
        public string Megjegyzes { get; set; } = "Nincs megjegyzés";
        public virtual User User { get; set; }
        public virtual Vetites Vetites { get; set; }
    }
}