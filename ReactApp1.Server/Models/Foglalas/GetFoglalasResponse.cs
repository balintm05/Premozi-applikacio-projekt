namespace ReactApp1.Server.Models.Foglalas
{
    public class GetFoglalasResponse
    {
        public Entities.Foglalas.FoglalasAdatok? foglalasAdatok {get;set;}
        public Models.ErrorModel? error { get; set; }
        public GetFoglalasResponse(Entities.Foglalas.FoglalasAdatok foglalas)
        {
            foglalasAdatok = foglalas;
        }
        public GetFoglalasResponse(string error)
        {
            this.error = new Models.ErrorModel(error);
        }
        public GetFoglalasResponse() { }
    }
}
