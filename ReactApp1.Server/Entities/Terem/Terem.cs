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
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Required]
        public string Nev { get; set; }

        public string Megjegyzes { get; set; } = "";

        public ICollection<Szekek> Szekek { get; set; } = new List<Szekek>();
    }
}