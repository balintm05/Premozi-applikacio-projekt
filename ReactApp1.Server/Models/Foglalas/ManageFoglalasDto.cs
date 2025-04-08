namespace ReactApp1.Server.Models.Rendeles
{
    public class ManageFoglalasDto
    {
        public string? id {  get; set; }
        public string? UserID {  get; set; }
        public string? VetitesID { get; set; }
        public List<string>? X {  get; set; }
        public List<string>? Y { get; set; }
        public List<string>? jegytipusId { get; set; }
        public ErrorModel? Error { get; set; }
    }
}