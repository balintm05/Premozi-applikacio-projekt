using ReactApp1.Server.Entities.Terem;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography;
using System.Text;

namespace ReactApp1.Server.Models.Terem
{
    public class ManageTeremDto
    {
        public string? id { get; set; }
        public string? Nev { get; set; }
        public string? Sorok { get; set; }
        public string? Oszlopok { get; set; }
        public string? Megjegyzes { get; set; }
        public List<SzekFrissites>? SzekekFrissites { get; set; }
    }

    public class SzekFrissites
    {
        public string op { get; set; }
        public string path { get; set; }
        public int value { get; set; }
    }

}