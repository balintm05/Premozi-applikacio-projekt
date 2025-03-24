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

        public int FoglalasAllapot { get; set; } 

        public virtual Vetites Vetites { get; set; } = null!;
        public virtual FoglaltSzekek FoglaltSzekek { get; set; }
    }
}
