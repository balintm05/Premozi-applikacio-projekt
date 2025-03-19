using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Entities.Vetites;

namespace ReactApp1.Server.Entities.Foglalas
{
    [PrimaryKey("Teremid", "X", "Y", "Vetitesid", "FoglalasAdatokid")]
    public class FoglaltSzekek
    {
        public int FoglalasAdatokid { get; set; }
        public int Teremid { get; set; } 
        public int X { get; set; }     
        public int Y { get; set; }   
        public int Vetitesid { get; set; }
        public virtual FoglalasAdatok FoglalasAdatok { get; set; } = null!;
        public virtual VetitesSzekek VetitesSzekek { get; set; } = null!;
    }
}
