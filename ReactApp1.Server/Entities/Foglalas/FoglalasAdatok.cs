using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace ReactApp1.Server.Entities.Foglalas
{
    public class FoglalasAdatok
    {
        [Key]
        public int id { get; set; }
        [Column(TypeName = "DateTime"), DataType(DataType.DateTime), Editable(false)]
        public DateTime FoglalasIdopontja { get; set; } = DateTime.UtcNow;
        public virtual User User { get; set; } = null!;
        public ICollection<FoglaltSzekek> FoglaltSzekek { get; } = new List<FoglaltSzekek>();
    }
}
