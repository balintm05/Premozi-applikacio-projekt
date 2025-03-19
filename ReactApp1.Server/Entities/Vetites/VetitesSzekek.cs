using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Entities.Foglalas;
using ReactApp1.Server.Entities.Terem;

namespace ReactApp1.Server.Entities.Vetites
{
    [PrimaryKey("Teremid", "X", "Y", "Vetitesid")]
    public class VetitesSzekek
    {
        public int Teremid { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int Vetitesid { get; set; }
        public int FoglalasAllapot { get; set; }
        public virtual Vetites Vetites { get; set; } = null!;
        public virtual Szekek Szekek { get; set; } = null!;
        public virtual FoglaltSzekek FoglaltSzekek { get; set; } = null!;
    }
}
