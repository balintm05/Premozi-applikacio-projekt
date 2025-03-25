using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.Models.User
{
    public class Complete2FALoginDto
    {
        [Required]
        public string TempToken { get; set; }

        [Required]
        [StringLength(6, MinimumLength = 6)]
        public string Code { get; set; }
    }
}
