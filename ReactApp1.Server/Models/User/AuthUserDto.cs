namespace ReactApp1.Server.Models.User
{
    public class AuthUserDto
    {
        public string? email { get; set; }
        public string? password { get; set; }
        public ErrorModel? Error { get; set; }
    }
}
