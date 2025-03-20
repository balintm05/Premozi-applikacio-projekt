using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApp1.Server.Entities
{
    public class HttpLog
    {
        public int Id { get; set; }
        public string Schema { get; set; }
        public string Host { get; set; }
        public string Path { get; set; }
        [Column(TypeName = "LONGTEXT")]
        public string QueryString { get; set; }
        [Column(TypeName = "LONGTEXT")]
        public string RequestHeaders { get; set; }
        [Column(TypeName ="LONGTEXT")]
        public string RequestBody { get; set; }
        [Column(TypeName = "LONGTEXT")]
        public string ResponseHeaders { get; set; }
        [Column(TypeName = "LONGTEXT")]
        public string ResponseBody { get; set; }
        public int StatusCode { get; set; }
        public DateTime LogTime { get; set; }
    }
}
