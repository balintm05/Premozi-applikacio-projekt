using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Entities.Foglalas;
using ReactApp1.Server.Entities.Terem;

namespace ReactApp1.Server.Entities.Vetites
{
    [PrimaryKey("Szekek", "Vetites")]
    public class VetitesSzekek
    {
        public int FoglalasAllapot { get; set; } = 0;
        public virtual Vetites Vetites { get; set; } = null!;
        public virtual Szekek Szekek { get; set; } = null!;
        public ICollection<FoglaltSzekek> FoglaltSzekek { get; } = new List<FoglaltSzekek>();

    }
}
