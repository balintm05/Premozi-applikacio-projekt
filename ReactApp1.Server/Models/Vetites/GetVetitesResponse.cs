using Newtonsoft.Json.Serialization;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography;
using System.Text;

namespace ReactApp1.Server.Models.Vetites
{
    public class GetVetitesResponse
    {
        public int id {  get; set; }
        public DateTime? Idopont { get; set; }
        public string? Megjegyzes { get; set; }
        public int? Filmid { get; set; }
        public int? Teremid { get; set; }
        public ErrorModel? Error { get; set; }
    }
}
