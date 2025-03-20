using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Entities.Foglalas;
using ReactApp1.Server.Entities.Terem;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApp1.Server.Entities.Vetites
{
    public class VetitesSzekek
    {

        public int Vetitesid { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int Teremid { get; set; }

        public int FoglalasAllapot { get; set; } = 0;

        [ForeignKey(nameof(Vetitesid))]
        public virtual Vetites Vetites { get; set; } = null!;

        [ForeignKey(nameof(Teremid) + "," + nameof(X) + "," + nameof(Y))]
        public virtual Szekek Szekek { get; set; } = null!;

        public ICollection<FoglaltSzekek> FoglaltSzekek { get; } = new List<FoglaltSzekek>();

    }
}
