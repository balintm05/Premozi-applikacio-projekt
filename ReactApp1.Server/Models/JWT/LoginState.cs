namespace ReactApp1.Server.Models.JWT
{
    public class LoginState
    {
        public bool IsLoggedIn { get; set; }
        public Entities.User? user { get; set; }
        public LoginState(bool isLoggedIn, Entities.User? user)
        {
            IsLoggedIn = isLoggedIn;
            this.user = user;
        }
    }
}
