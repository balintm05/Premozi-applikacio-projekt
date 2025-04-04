using ReactApp1.Server.Entities.Vetites;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace ReactApp1.Server.Entities.Foglalas
{
    public class JegyTipus
    {
        [Key]
        public int id { get; set; }
        public string Nev {  get; set; }
        public int Ar {  get; set; }
    }
}
