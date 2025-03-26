using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.Models.User
{
    public class VerifyEmail2FADto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [RegularExpression(@"^\d{6}$")]
        public string Code { get; set; } = string.Empty;
    }
    public class Enable2FADto
    {
        [Required]
        public int UserId { get; set; }
    }
    public class Disable2FADto
    {
        [Required]
        public int UserId { get; set; }
        [StringLength(30, MinimumLength = 6)]
        [RegularExpression(@"^[a-zA-Z0-9_.-]*$")]
        public string? Password { get; set; }
    }
    public class AdminDisable2FADto
    {
        [Required]
        public int TargetUserId { get; set; } 

        [Required]
        public int AdminUserId { get; set; }  
    }
}
