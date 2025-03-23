using ReactApp1.Server.Entities.Vetites;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace ReactApp1.Server.Entities.Foglalas
{
    public class FoglalasAdatok
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime FoglalasIdopontja { get; set; } = DateTime.UtcNow;

        public int UserID { get; set; }
        [ForeignKey("UserID")]
        public virtual User User { get; set; } = null!;        
        public ICollection<FoglaltSzekek> FoglaltSzekek { get; } = new List<FoglaltSzekek>();
    }
}
