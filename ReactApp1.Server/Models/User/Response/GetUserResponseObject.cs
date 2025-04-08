namespace ReactApp1.Server.Models.User.Response
{
    public class GetUserResponseObject
    {
        public GetUserResponseObject(Entities.User user)
        {
            userID = user.userID.ToString();
            email = user.email;
            creationDate = user.creationDate;
            accountStatus = user.accountStatus.ToString();
            role = user.role;
            Megjegyzes = user.Megjegyzes;

        }
        public string? userID {  get; set; }
        public string? email { get; set; }
        public DateTime? creationDate { get; set; }
        public string? accountStatus { get; set; }
        public string? role { get; set; }
        public string? Megjegyzes { get; set; }
    }
}
