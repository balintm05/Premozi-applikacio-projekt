using Newtonsoft.Json.Serialization;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography;
using System.Text;

namespace ReactApp1.Server.Entities.Vetites
{
    public class Vetites
    {
        [Key, Column(TypeName = "int(5)"), DatabaseGenerated(DatabaseGeneratedOption.Identity), NotNull, Required, Editable(false)]
        public int id { get; set; }
        [Column(TypeName = "DateTime"), NotNull, Required, DataType(DataType.Text, ErrorMessage = "Kötelező időpontot megadni")]
        public DateTime Idopont { get; set; }
        [Column(TypeName = "longtext"), NotNull, DataType(DataType.Text, ErrorMessage = "Hiba történt a megjegyzés hozzáadása során")]
        public string Megjegyzes { get; set; } = "Nincs megjegyzés";
        [Length(1, 11, ErrorMessage = "Kötelező film ID-t megadni")]
        public int Filmid { get; set; }
        [Length(1, 5, ErrorMessage = "Kötelező terem ID-t megadni")]
        public int Teremid { get; set; }
        public virtual Film Film { get; set; } = null!;
        public virtual Terem.Terem Terem { get; set; } = null!;
    }
}
