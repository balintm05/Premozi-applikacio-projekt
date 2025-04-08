using System.ComponentModel.DataAnnotations;

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
