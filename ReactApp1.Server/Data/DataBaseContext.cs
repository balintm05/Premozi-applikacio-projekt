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
        public DbSet<HttpLog> HttpLogs { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure Szekek (Seat) entity
            modelBuilder.Entity<Szekek>(entity =>
            {
                entity.HasKey(s => new { s.Teremid, s.X, s.Y });

                entity.HasOne(s => s.Terem)
                      .WithMany(t => t.Szekek)
                      .HasForeignKey(s => s.Teremid);
            });

            // Configure VetitesSzekek (Screening Seat) entity
            modelBuilder.Entity<VetitesSzekek>(entity =>
            {
                entity.HasKey(vs => new { vs.Vetitesid, vs.Teremid, vs.X, vs.Y });

                entity.HasOne(vs => vs.Vetites)
                      .WithMany(v => v.VetitesSzekek)
                      .HasForeignKey(vs => vs.Vetitesid);

                entity.HasOne(vs => vs.Szekek)
                      .WithMany(s => s.VetitesSzekek)
                      .HasForeignKey(vs => new { vs.Teremid, vs.X, vs.Y });

                // One-to-one relationship with FoglaltSzekek
                entity.HasOne(vs => vs.FoglaltSzekek)
                      .WithOne(fs => fs.VetitesSzekek)
                      .HasForeignKey<FoglaltSzekek>(fs => new { fs.Vetitesid, fs.Teremid, fs.X, fs.Y });
            });

            // Configure FoglaltSzekek (Booked Seat) entity
            modelBuilder.Entity<FoglaltSzekek>(entity =>
            {
                entity.HasKey(fs => new { fs.FoglalasAdatokid, fs.Vetitesid, fs.Teremid, fs.X, fs.Y });

                entity.HasOne(fs => fs.FoglalasAdatok)
                      .WithMany(fa => fa.FoglaltSzekek)
                      .HasForeignKey(fs => fs.FoglalasAdatokid);

                // One-to-one relationship with VetitesSzekek
                entity.HasOne(fs => fs.VetitesSzekek)
                      .WithOne(vs => vs.FoglaltSzekek)
                      .HasForeignKey<FoglaltSzekek>(fs => new { fs.Vetitesid, fs.Teremid, fs.X, fs.Y });
            });

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.email).IsUnique();
                entity.HasIndex(u => u.refreshToken).IsUnique();
            });

            // Configure HttpLog entity
            modelBuilder.Entity<HttpLog>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.LogTime).HasDefaultValueSql("UTC_TIMESTAMP");
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
