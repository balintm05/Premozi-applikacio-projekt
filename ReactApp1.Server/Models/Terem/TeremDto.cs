using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography;
using System.Text;

namespace ReactApp1.Server.Models.Terem
{
    public class TeremDto
    {
        public int? Ferohely { get; set; }
        public string? Tipus { get; set; }
        public int? Sorok { get; set; }
        public string? Allapot { get; set; } = "Működik";
        public string? Megjegyzes { get; set; } = "";
        public ErrorModel? Error { get; set; }
    }
}