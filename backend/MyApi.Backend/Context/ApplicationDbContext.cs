using Microsoft.EntityFrameworkCore;
using MyApi.Backend.Models; // Ensure this matches your Room model namespace

namespace MyApi.Backend.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Add your tables here
        public DbSet<Room> Rooms { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Medicine> Medicines { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<PatientRoom> PatientRooms {get;set;}
        public DbSet<Treatment> Treatments {get;set;}
        public DbSet<Transaction> Transactions {get;set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Patient>()
                .Property(p => p.arrival_date)
                .HasDefaultValueSql("CURRENT_TIMESTAMP"); // Set default value to current date and

            modelBuilder.Entity<PatientRoom>()
                .Property(p => p.createdAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<Transaction>()
                .Property(p => p.createdAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<Treatment>()
                .Property(p => p.createdAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            
        }
    }
}