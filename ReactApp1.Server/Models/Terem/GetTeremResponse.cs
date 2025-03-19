using ReactApp1.Server.Entities;

namespace ReactApp1.Server.Models.Terem
{
    public class GetTeremResponse
    {
        public Entities.Terem? Terem { get; set; }
        public Models.ErrorModel? error { get; set; }
        public GetTeremResponse(Entities.Terem terem)
        {
            Terem = terem;
        }
    }
}
