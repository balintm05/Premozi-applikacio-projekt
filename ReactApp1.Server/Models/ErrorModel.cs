namespace ReactApp1.Server.Models
{
    public class ErrorModel
    {
        public ErrorModel(string message)
        {
            errorMessage = message;
        }
        public string errorMessage { get; set; }
    }
}
