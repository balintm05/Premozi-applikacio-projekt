using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography;
using System.Text;

namespace ReactApp1.Server.Models.Rendeles
{
    public class ManageFoglalasDto
    {
        public string? id {  get; set; }
        public string? UserID {  get; set; }
        public string? VetitesID { get; set; }
        public List<string>? X {  get; set; }
        public List<string>? Y { get; set; }
        public ErrorModel? Error { get; set; }
    }
}