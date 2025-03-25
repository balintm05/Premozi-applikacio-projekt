namespace ReactApp1.Server.Entities
{
    public class Images
    {
        public int Id { get; set; }
        public string RelativePath { get; set; }
        public string FileName { get; set; }
        public string OriginalFileName { get; set; }
        public string ContentType { get; set; }
        public long FileSize { get; set; }
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;
    }
}
