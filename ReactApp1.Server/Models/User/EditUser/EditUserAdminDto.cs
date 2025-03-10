namespace ReactApp1.Server.Models.User.EditUser
{
    public class EditUserAdminDto
    {
        public string? email { get; set; }
        public string? role { get; set; }
        public int? account_status { get; set; }
        public string? Megjegyzes { get; set; }
        public ErrorModel? Error { get; set; }
    }
}
