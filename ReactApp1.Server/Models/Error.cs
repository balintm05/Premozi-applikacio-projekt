using Microsoft.OpenApi.MicrosoftExtensions;

namespace ReactApp1.Server.Models
{
    public class Error
    {
        public Error(string message)
        {
            errorMessage = message;
        }
        public string errorMessage { get; set; }
    }
}
