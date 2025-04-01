using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.Models.User.EditUser
{
    public class EditPasswordDto
    {
        [Required]
        public string currentPassword { get; set; }

        [Required]
        [StringLength(30, MinimumLength = 6, ErrorMessage = "A jelszónak 6 és 30 karakter között kell lennie")]
        public string newPassword { get; set; }

        public bool forceChange { get; set; } = false;
        public ErrorModel? Error { get; set; }
    }
    public class PasswordResetRequestDto
    {
        public int UserId { get; set; }
        public ErrorModel? Error { get; set; }
    }
    public class CompletePasswordResetDto
    {
        public int UserId { get; set; }
        public string Token { get; set; }
        public string NewPassword { get; set; }
        public ErrorModel? Error { get; set; }
    }
}
