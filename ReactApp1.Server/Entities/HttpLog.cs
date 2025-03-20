namespace ReactApp1.Server.Entities
{
    public class HttpLog
    {
        public int Id { get; set; }
        public string Schema { get; set; }
        public string Host { get; set; }
        public string Path { get; set; }
        public string QueryString { get; set; }
        public string RequestHeaders { get; set; }
        public string RequestBody { get; set; }
        public string ResponseHeaders { get; set; }
        public string ResponseBody { get; set; }
        public int StatusCode { get; set; }
        public DateTime LogTime { get; set; }
    }
}
