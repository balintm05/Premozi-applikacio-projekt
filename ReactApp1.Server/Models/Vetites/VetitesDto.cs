using Newtonsoft.Json.Serialization;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography;
using System.Text;

namespace ReactApp1.Server.Models.Vetites
{
    public class VetitesDto
    {
        public DateTime Idopont { get; set; }
        public string Megjegyzes { get; set; } = "Nincs megjegyzés";
        public virtual Entities.Film Film { get; set; }
        public virtual Entities.Terem Terem { get; set; }
    }
}
