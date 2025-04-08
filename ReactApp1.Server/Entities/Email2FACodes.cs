using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


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
