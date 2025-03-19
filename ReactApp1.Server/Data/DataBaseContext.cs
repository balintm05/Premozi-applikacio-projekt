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
            modelBuilder.Entity<Terem>()
                .HasMany(e => e.Szekek)
                .WithOne(e => e.Terem)
                .HasForeignKey(e => e.Teremid)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Szekek>()
                .HasKey(s => new { s.Teremid, s.X, s.Y });
            modelBuilder.Entity<Szekek>()
                .HasOne(s => s.Terem)
                .WithMany(t => t.Szekek)
                .HasForeignKey(s => s.Teremid)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<VetitesSzekek>()
                .HasKey(vs => new { vs.Teremid, vs.X, vs.Y, vs.Vetitesid });
            modelBuilder.Entity<VetitesSzekek>()
                .HasOne(vs => vs.Szekek)
                .WithMany()
                .HasForeignKey(vs => new { vs.Teremid, vs.X, vs.Y })
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<VetitesSzekek>()
                .HasOne(vs => vs.Vetites)
                .WithMany()
                .HasForeignKey(vs => vs.Vetitesid)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<VetitesSzekek>()
                .HasOne(vs => vs.FoglaltSzekek)
                .WithOne(fs => fs.VetitesSzekek)
                .HasForeignKey<FoglaltSzekek>(fs => new { fs.Teremid, fs.X, fs.Y, fs.Vetitesid })
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<FoglaltSzekek>()
                .HasKey(fs => new { fs.Teremid, fs.X, fs.Y, fs.Vetitesid });
            modelBuilder.Entity<FoglaltSzekek>()
                .HasOne(fs => fs.FoglalasAdatok)
                .WithMany()
                .HasForeignKey(fs => fs.FoglalasAdatokid)
                .HasPrincipalKey(fs=>fs.id)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<FoglaltSzekek>()
                .HasOne(fs => fs.VetitesSzekek)
                .WithOne(vs => vs.FoglaltSzekek)
                .HasForeignKey<VetitesSzekek>(vs => new { vs.Teremid, vs.X, vs.Y, vs.Vetitesid })
                .OnDelete(DeleteBehavior.Cascade);
            base.OnModelCreating(modelBuilder);
        }
    }
}
