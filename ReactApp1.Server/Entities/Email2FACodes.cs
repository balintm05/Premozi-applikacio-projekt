using ReactApp1.Server.Entities.Foglalas;
using ReactApp1.Server.Entities.Vetites;
using ReactApp1.Server.Models.Film.ManageFilm;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography;
using System.Text;


namespace ReactApp1.Server.Entities
{
    public class Email2FACodes
    {
        [Key]
        public int Id {  get; set; }
        public string Code { get; set; }
        public int UserID { get; set; }
        public DateTime ExpiresAt { get; set; }
        [ForeignKey("UserID")]
        public User User { get; set; }
    }
}
