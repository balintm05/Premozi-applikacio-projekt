namespace ReactApp1.Server.Models.JWT
{
    public class LoginState
    {
        public bool IsLoggedIn { get; set; }
        public LoginState(bool isLoggedIn)
        {
            IsLoggedIn = isLoggedIn;
        }
    }
}
