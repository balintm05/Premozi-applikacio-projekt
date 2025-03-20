using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Entities;
using ReactApp1.Server.Entities.Foglalas;
using ReactApp1.Server.Entities.Terem;
using ReactApp1.Server.Entities.Vetites;

namespace ReactApp1.Server.Data
{   
    //table.UniqueConstraint("UK_Users_Email", x => x.email); table.UniqueConstraint("UK_Users_refreshToken", x => x.refreshToken);
    public class DataBaseContext(DbContextOptions<DataBaseContext> options) : DbContext(options)
    {
        public DbSet<FoglalasAdatok> FoglalasAdatok { get; set; }
        public DbSet<FoglaltSzekek> FoglaltSzekek { get; set; }
        public DbSet<Szekek> Szekek { get; set; }
        public DbSet<Terem> Terem { get; set; }
        public DbSet<Vetites> Vetites { get; set; }
        public DbSet<VetitesSzekek> VetitesSzekek { get; set; }
        public DbSet<Film> Film { get; set; }
        public DbSet<User> Users { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Composite Primary Keys
            modelBuilder.Entity<Szekek>()
                .HasKey(s => new { s.Teremid, s.X, s.Y });

            modelBuilder.Entity<VetitesSzekek>()
                .HasKey(vs => new { vs.Vetitesid, vs.Teremid, vs.X, vs.Y });

            modelBuilder.Entity<FoglaltSzekek>()
                .HasKey(fs => new { fs.FoglalasAdatokid, fs.Vetitesid, fs.Teremid, fs.X, fs.Y });

            // Relationships
            modelBuilder.Entity<Szekek>()
                .HasOne(s => s.Terem)
                .WithMany(t => t.Szekek)
                .HasForeignKey(s => s.Teremid);

            modelBuilder.Entity<VetitesSzekek>()
                .HasOne(vs => vs.Vetites)
                .WithMany(v => v.VetitesSzekek)
                .HasForeignKey(vs => vs.Vetitesid);

            modelBuilder.Entity<VetitesSzekek>()
                .HasOne(vs => vs.Szekek)
                .WithMany(s => s.VetitesSzekek)
                .HasForeignKey(vs => new { vs.Teremid, vs.X, vs.Y });

            modelBuilder.Entity<FoglaltSzekek>()
                .HasOne(fs => fs.FoglalasAdatok)
                .WithMany(fa => fa.FoglaltSzekek)
                .HasForeignKey(fs => fs.FoglalasAdatokid);

            modelBuilder.Entity<FoglaltSzekek>()
                .HasOne(fs => fs.VetitesSzekek)
                .WithMany(vs => vs.FoglaltSzekek)
                .HasForeignKey(fs => new { fs.Vetitesid, fs.Teremid, fs.X, fs.Y });
            base.OnModelCreating(modelBuilder);
        }
    }
}
