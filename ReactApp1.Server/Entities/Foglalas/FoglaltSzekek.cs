using ReactApp1.Server.Entities.Vetites;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApp1.Server.Entities.Foglalas
{
    public class FoglaltSzekek
    {
        public int Vetitesid { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int FoglalasAdatokid { get; set; }
        public int JegyTipusId { get; set; }
        [ForeignKey("JegyTipusId")]
        public virtual JegyTipus JegyTipus { get; set; }
        public virtual FoglalasAdatok FoglalasAdatok { get; set; }
        public virtual VetitesSzekek VetitesSzekek { get; set; }
    }
}
