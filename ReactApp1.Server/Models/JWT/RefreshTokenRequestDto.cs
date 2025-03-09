namespace ReactApp1.Server.Models.JWT
{
    public class RefreshTokenRequestDto
    {
        public int userID { get; set; }
        public required string RefreshToken { get; set; }
    }
}
