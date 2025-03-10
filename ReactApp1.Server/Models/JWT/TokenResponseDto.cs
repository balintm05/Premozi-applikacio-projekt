namespace ReactApp1.Server.Models.JWT
{
    public class TokenResponseDto
    {
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public string? Error {  get; set; }
    }
}
