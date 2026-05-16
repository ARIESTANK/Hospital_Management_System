using MyApi.Backend.Models;
using MyApi.Backend.DTOs;
namespace MyApi.Backend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<User?> LoginService(LoginDto login);
    }

    public interface IUserService
    {
        Task<User?> FindById(int id);
        Task<User> CreateUser(CreateUserDto user);

        Task<List<User>> GetAllUsers();
    }

    public interface IPatientService
    {
        Task<Patient?> CreatePatient(CreatePatientDto patient);
        Task<Patient?> FindById(int id);
        Task<List<Patient?>> GetAllPatients();
    }
}