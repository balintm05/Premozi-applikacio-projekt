
namespace ReactApp1.Server.Models.User.Response
{
    public class GetUserQueryObject
    {
        public int? userID { get; set; }
        public string? email { get; set; }
        public int? account_status { get; set; }
        public string? role { get; set; }
        public string? Megjegyzes { get; set; }
    }
}