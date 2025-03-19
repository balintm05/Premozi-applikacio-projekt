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
        public DbSet<Szekek> Szekek { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Terem>().HasMany(e => e.Szekek).WithOne(e => e.Terem).HasForeignKey(e=>e.Teremid).IsRequired();
            modelBuilder.Entity<Szekek>().HasOne(e => e.Terem).WithMany(e => e.Szekek).HasForeignKey(e => e.Teremid).IsRequired();
        }
    }
}
