using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Entities;

namespace ReactApp1.Server.Data
{
    public class DataBaseContext(DbContextOptions<DataBaseContext> options) : DbContext(options)
    {
        public DbSet<Film> Film { get; set; }
        public DbSet<Terem> Terem { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Vetites> Vetites { get; set; }
        public DbSet<Rendeles> Rendeles { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
