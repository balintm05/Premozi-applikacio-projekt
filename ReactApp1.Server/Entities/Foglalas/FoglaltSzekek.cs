using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Entities.Vetites;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApp1.Server.Entities.Foglalas
{
    public class FoglaltSzekek
    {
        public int FoglalasAdatokid { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int Vetitesid { get; set; }
        public int Teremid { get; set; }

        [ForeignKey(nameof(FoglalasAdatokid))]
        public virtual FoglalasAdatok FoglalasAdatok { get; set; } = null!;

        [ForeignKey(nameof(Vetitesid) + "," + nameof(Teremid) + "," + nameof(X) + "," + nameof(Y))]
        public virtual VetitesSzekek VetitesSzekek { get; set; } = null!;
    }
}
