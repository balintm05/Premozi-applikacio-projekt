using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.Models.User
{
    public class VerifyEmail2FADto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [RegularExpression(@"^\d{6}$", ErrorMessage = "Code must be 6 digits")]
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
        [StringLength(30, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 30 characters")]
        [RegularExpression(@"^[a-zA-Z0-9_.-]*$", ErrorMessage = "Password can only contain alphanumeric characters, dots, underscores and hyphens")]
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
