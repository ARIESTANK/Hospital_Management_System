using Microsoft.EntityFrameworkCore;
using MyApi.Backend.Context;
using MyApi.Backend.Models;
using MyApi.Backend.Repository.Interface;
using MyApi.Backend.DTOs;
namespace MyApi.Backend.Repositories
{
    public class PatientRepository : IPatientRepo
    {
        private readonly ApplicationDbContext _context;

        public PatientRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Patient?> CreatePatient(Patient patient)
        {
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
            return patient;
        }

        public async Task<Patient?> FindById(int id)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.patientId == id);
            return patient;
        }

        public async Task<List<Patient?>> GetAllPatients()
        {
            var patients = await _context.Patients.ToListAsync();
            return patients;
        }

        
    }
}