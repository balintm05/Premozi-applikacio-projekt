using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.Models.User.EditUser
{
    public class EditUserDto
    {
        [Required]
        [EmailAddress]
        public string email { get; set; }
        [Required]
        public string currentPassword { get; set; }

        public ErrorModel? Error { get; set; }
    }

}
