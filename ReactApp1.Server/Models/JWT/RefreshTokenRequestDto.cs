namespace ReactApp1.Server.Models.JWT
{
    public class RefreshTokenRequestDto
    {
        public int? userID { get; set; }
        public string? RefreshToken { get; set; }
        public ErrorModel? Error { get; set; }
    }
}
