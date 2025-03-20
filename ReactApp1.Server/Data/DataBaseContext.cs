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
            base.OnModelCreating(modelBuilder);

            // Configure the VetitesSzekek entity
            modelBuilder.Entity<VetitesSzekek>()
                .HasKey(vs => new { vs.Szekek, vs.Vetites });

            modelBuilder.Entity<VetitesSzekek>()
                .HasOne(vs => vs.Szekek)
                .WithMany()
                .HasForeignKey(vs => vs.Szekek);

            modelBuilder.Entity<VetitesSzekek>()
                .HasOne(vs => vs.Vetites)
                .WithMany()
                .HasForeignKey(vs => vs.Vetites);

            // Configure the FoglaltSzekek entity
            modelBuilder.Entity<FoglaltSzekek>()
                .HasKey(fs => new { fs.FoglalasAdatok, fs.VetitesSzekek });

            modelBuilder.Entity<FoglaltSzekek>()
                .HasOne(fs => fs.FoglalasAdatok)
                .WithMany()
                .HasForeignKey(fs => fs.FoglalasAdatok);

            modelBuilder.Entity<FoglaltSzekek>()
                .HasOne(fs => fs.VetitesSzekek)
                .WithMany()
                .HasForeignKey(fs => fs.VetitesSzekek);

            // Configure the Szekek entity
            modelBuilder.Entity<Szekek>()
                .HasKey(s => new { s.Terem, s.X, s.Y });

            modelBuilder.Entity<Szekek>()
                .HasOne(s => s.Terem)
                .WithMany(t => t.Szekek)
                .HasForeignKey(s => s.Terem);

            // Configure the Terem entity
            modelBuilder.Entity<Terem>()
                .HasKey(t => t.id);

            // Configure the FoglalasAdatok entity
            modelBuilder.Entity<FoglalasAdatok>()
                .HasKey(fa => fa.id);

            modelBuilder.Entity<FoglalasAdatok>()
                .HasOne(fa => fa.User)
                .WithMany()
                .HasForeignKey(fa => fa.User);

            // Configure the User entity
            modelBuilder.Entity<User>()
                .HasKey(u => u.userID);

            // Configure the Film entity
            modelBuilder.Entity<Film>()
                .HasKey(f => f.id);
        }
    }
}
