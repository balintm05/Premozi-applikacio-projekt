using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        public ICollection<Vetites.Vetites> Vetites { get;  } = new List<Vetites.Vetites>();
    }
}