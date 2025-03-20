using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Entities.Vetites;

namespace ReactApp1.Server.Entities.Foglalas
{
    [PrimaryKey("FoglalasAdatok", "VetitesSzekek")]
    public class FoglaltSzekek
    {
        public virtual FoglalasAdatok FoglalasAdatok { get; set; } = null!;
        public virtual VetitesSzekek VetitesSzekek { get; set; } = null!;
    }
}
