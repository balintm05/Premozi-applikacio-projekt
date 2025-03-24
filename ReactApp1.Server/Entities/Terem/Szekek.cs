using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Entities.Vetites;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace ReactApp1.Server.Entities.Terem
{
    public class Szekek
    {

        public int X { get; set; }
        public int Y { get; set; }

        public int Teremid { get; set; }
        [ForeignKey(nameof(Teremid))]
        public virtual Terem Terem { get; set; } = null!;

        public int Allapot { get; set; } = 1;
    }
}
