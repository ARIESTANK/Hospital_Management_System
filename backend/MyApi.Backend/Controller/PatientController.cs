using Microsoft.AspNetCore.Mvc;
using MyApi.Backend.Models;
using MyApi.Backend.DTOs;
using MyApi.Backend.Services.Interfaces;

namespace MyApi.Backend.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientservice;

        public PatientController(IPatientService patientservice)
        {
            _patientservice = patientservice;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> getPatientById(int id)
        {
            var patient = await _patientservice.FindById(id);
            if(patient == null) return NotFound("Patient Not Found");
            else return Ok(patient);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllPatients(){
            var patients = await _patientservice.GetAllPatients();
            if(patients==null) return NotFound("Patients not found");
            else return Ok(patients);
        }

        [HttpPost]
        public async Task<IActionResult> createPatient(CreatePatientDto newpatient)
        {
            var patient = await _patientservice.CreatePatient(newpatient);
            return Ok(patient);
        }
        
    }
}