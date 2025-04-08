namespace ReactApp1.Server.Models.User.Response
{
    public class GetUserQueryFilter
    {
        public string? userID { get; set; }
        public string? email { get; set; }
        public string? accountStatus { get; set; }
        public string? role { get; set; }
        public string? Megjegyzes { get; set; }
    }
}