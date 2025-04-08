namespace ReactApp1.Server.Models.Vetites
{
    public class GetVetitesResponse
    {
        public Entities.Vetites.Vetites? Vetites { get; set; }
        public ErrorModel? Error { get; set; }
        public GetVetitesResponse(Entities.Vetites.Vetites vetites)
        {
            Vetites = vetites;
        }
        public GetVetitesResponse(string err)
        {
            Error = new ErrorModel(err);
        }
    }
}
