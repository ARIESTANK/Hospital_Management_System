using MyApi.Backend.Models;
using MyApi.Backend.DTOs;
using MyApi.Backend.Enum;
using MyApi.Backend.Repository.Interface;
using MyApi.Backend.Services.Interfaces;
namespace MyApi.Backend.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepo _userrepository;

        public UserService(IUserRepo userrepository)
        {
            _userrepository = userrepository;
        }

    public async Task<User?> CreateUser(CreateUserDto dto)
        {
            var newUser = await _userrepository.FindByEmail(dto.Email);
            if(newUser != null ) return null;
            else
            {
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password); // hashed password generate
                User user = new User
                {
                    userName = dto.UserName,
                    userEmail = dto.Email,
                    userPassword = hashedPassword,
                    userRole = dto.Role == "ADMIN" ? Role.ADMIN : dto.Role == "CLINIC" ? Role.CLINIC : dto.Role == "DOCTOR" ? Role.DOCTOR : Role.RECEPTIONIST,
                    userGender = dto.UserGender == "MALE" ? Gender.MALE : dto.UserGender == "FEMALE" ? Gender.FEMALE : Gender.OTHER,
                };

                var userCreated = await _userrepository.CreateUser(user);
                return userCreated;
            }
        }

    public async Task<User?> FindById(int id)
        {
            var existUser = await _userrepository.FindById(id);
            return existUser;
        }

    public async Task<List<User>> GetAllUsers()
        {
            var users = await _userrepository.GetAllUsers();
            return users;
        }
    }

}