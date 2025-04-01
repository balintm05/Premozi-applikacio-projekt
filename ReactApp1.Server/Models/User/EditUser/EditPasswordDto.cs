namespace ReactApp1.Server.Models.User.EditUser
{
    public class EditPasswordDto
    {
        public string? currentPassword { get; set; }
        public string? newPassword { get; set; }
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
