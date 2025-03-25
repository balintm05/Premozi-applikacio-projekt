namespace ReactApp1.Server.Models
{
    public class ImageUploadResponse
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public long OriginalSize { get; set; }
        public long ProcessedSize { get; set; }
        public DateTime UploadDate { get; set; }
        public ErrorModel Error { get; set; }
    }
}
