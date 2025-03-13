using Org.BouncyCastle.Bcpg;

namespace ReactApp1.Server.Models.User.Response
{
    public class GetUserResponseObject
    {
        public GetUserResponseObject(Entities.User user)
        {
            userID = user.userID;
            email = user.email;
            creation_date = user.creation_date;
            account_status = user.account_status;
            role = user.role;
            Megjegyzes = user.Megjegyzes;

        }
        public int? userID {  get; set; }
        public string? email { get; set; }
        public DateTime? creation_date { get; set; }
        public int? account_status { get; set; }
        public string? role { get; set; }
        public string? Megjegyzes { get; set; }
    }
}
