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
            
        }
    }
}