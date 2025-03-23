using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Entities.Vetites;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApp1.Server.Entities.Foglalas
{
    public class FoglaltSzekek
    {
        // Foreign key properties (part of composite PK)
        public int Vetitesid { get; set; }
        public int Teremid { get; set; }
        public int X { get; set; }
        public int Y { get; set; }

        // Foreign key to FoglalasAdatok
        public int FoglalasAdatokid { get; set; }

        // Navigation properties
        public virtual FoglalasAdatok FoglalasAdatok { get; set; }
        public virtual VetitesSzekek VetitesSzekek { get; set; }
    }
}
