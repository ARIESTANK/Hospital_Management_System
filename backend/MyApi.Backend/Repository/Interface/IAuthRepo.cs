using MyApi.Backend.Models;
using MyApi.Backend.DTOs;
namespace MyApi.Backend.Repository.Interface
{
    public interface IAuthRepo
    {
        Task<User?> FetchByEmail(string email);
    }

    public interface IUserRepo
    {
        Task<User> CreateUser(User user);
        Task<User?> FindById(int id);
        Task<User?> FindByEmail(string email);
        Task<List<User>> GetAllUsers();
    }

    public interface IPatientRepo
    {
        Task<Patient?> CreatePatient(Patient patint);
        Task<Patient?> FindById(int id);
        Task<List<Patient?>> GetAllPatients();
    }
}
