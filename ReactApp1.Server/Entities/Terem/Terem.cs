using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography;
using System.Text;

namespace ReactApp1.Server.Entities.Terem
{
    public class Terem
    {
        [Key, Column(TypeName = "int(5)"), DatabaseGenerated(DatabaseGeneratedOption.Identity), NotNull, Required, Editable(false)]
        public int id { get; set; }
        [Column(TypeName = "text"), NotNull, Required, DataType(DataType.Text)]
        public string Nev { get; set; }
        [Column(TypeName = "longtext"), NotNull, DataType(DataType.Text)]
        public string Megjegyzes { get; set; } = "";
        public ICollection<Szekek> Szekek { get; } = new List<Szekek>();
    }
}