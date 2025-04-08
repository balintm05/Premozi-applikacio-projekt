using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApp1.Server.Entities.Vetites
{
    public class Vetites
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime Idopont { get; set; }

        public string Megjegyzes { get; set; } = "";

        public int Filmid { get; set; }
        [ForeignKey(nameof(Filmid))]
        public virtual Film Film { get; set; } = null!;

        public int Teremid { get; set; }
        [ForeignKey(nameof(Teremid))]
        public virtual Terem.Terem Terem { get; set; } = null!;

        public ICollection<VetitesSzekek> VetitesSzekek { get; } = new List<VetitesSzekek>();

    }
}
