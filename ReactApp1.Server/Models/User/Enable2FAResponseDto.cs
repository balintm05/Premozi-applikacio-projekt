namespace ReactApp1.Server.Models.User
{
    public class Enable2FAResponseDto
    {
        public string SecretKey { get; set; }
        public string QrCodeUrl { get; set; }
        public List<string> RecoveryCodes { get; set; }
    }
}
