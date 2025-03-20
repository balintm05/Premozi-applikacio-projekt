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
        public Entities.Vetites.Vetites? Vetites { get; set; }
        public ErrorModel? Error { get; set; }
        public GetVetitesResponse(Entities.Vetites.Vetites vetites)
        {
            Vetites = vetites;
        }
        public GetVetitesResponse(string err)
        {
            Error = new ErrorModel(err);
        }
    }
}
