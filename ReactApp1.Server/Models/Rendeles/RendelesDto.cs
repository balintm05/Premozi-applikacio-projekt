using ReactApp1.Server.Entities;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography;
using System.Text;

namespace ReactApp1.Server.Models.Rendeles
{
    public class RendelesDto
    {
        public int Hely { get; set; }
        public int Statusz { get; set; }
        public string Megjegyzes { get; set; }
        public virtual Entities.User User { get; set; }
        public virtual Entities.Vetites Vetites { get; set; }
    }
}