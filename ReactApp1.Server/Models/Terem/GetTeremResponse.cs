namespace ReactApp1.Server.Models.Terem
{
    public class GetTeremResponse
    {
        public Entities.Terem.Terem? Terem { get; set; }
        public Models.ErrorModel? error { get; set; }
        public GetTeremResponse(Entities.Terem.Terem terem)
        {
            Terem = terem;
        }
        public GetTeremResponse(string error)
        {
            this.error = new Models.ErrorModel(error);
        }
    }
}
