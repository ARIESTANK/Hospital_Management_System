using MyApi.Backend.Models;
using MyApi.Backend.DTOs;
using MyApi.Backend.Enum;
using MyApi.Backend.Repository.Interface;
using MyApi.Backend.Services.Interfaces;
namespace MyApi.Backend.Service
{
    public class PatientService : IPatientService
    {
        private readonly IPatientRepo _patientrepository;

        public PatientService(IPatientRepo patientrepository)
        {
            _patientrepository = patientrepository;
        }

        public async Task<Patient> CreatePatient(CreatePatientDto newPatient)
        {
            Patient patient = new Patient
            {
                name = newPatient.name,
                gender = newPatient.gender == "MALE" ? Gender.MALE : newPatient.gender == "FEMALE" ? Gender.FEMALE : Gender.OTHER,
                age = newPatient.age,
                patientCase = newPatient.hcase == "ACCIDENT" ? Case.ACCIDENT:
                            newPatient.hcase == "POISONING" ? Case.POISONING:
                            newPatient.hcase == "WOUNDS" ? Case.WOUNDS:
                            newPatient.hcase == "INTERNAL_ORGAN" ? 
                            Case.INTERNAL_ORGAN:Case.OTHERS,
                status = newPatient.status == "EMERGENCY_STATE" ? HealthStatus.EMERGENCY_STATE:
                        newPatient.status == "NORMAL_STATE" ? HealthStatus.NORMAL_STATE:
                        HealthStatus.NO_URGENT,
                arrival_date = DateTime.Now
                
            };
            var patientCreate = await _patientrepository.CreatePatient(patient);
            return patientCreate;
        }

        public async Task<Patient?> FindById(int id)
        {
            var patient = await _patientrepository.FindById(id);
            return patient;
        }

        public async Task<List<Patient?>> GetAllPatients(){
            var patients = await _patientrepository.GetAllPatients();
            return patients;
        }

        

    

    }

}