using MyApi.Backend.Models;
using MyApi.Backend.DTOs;
using MyApi.Backend.Repository.Interface;
using MyApi.Backend.Services.Interfaces;
namespace MyApi.Backend.Service
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepo _authrepository;

        public AuthService(IAuthRepo authrepository)
        {
            _authrepository = authrepository;
        }

    public async Task<User?> LoginService(LoginDto login)
        {
            var user = await _authrepository.FetchByEmail(login.Email);
            if(user==null) return null;
            bool isCorrect = BCrypt.Net.BCrypt.Verify(login.Password,user.userPassword); // password verify (Login Password,HashedStoredPassword)
            if(!isCorrect) return null; 
            else
            {
                return user;
            }
        }

    }

}