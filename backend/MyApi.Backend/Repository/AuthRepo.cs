using Microsoft.EntityFrameworkCore;
using MyApi.Backend.Context;
using MyApi.Backend.Models;
using MyApi.Backend.Repository.Interface;
using MyApi.Backend.DTOs;
namespace MyApi.Backend.Repositories
{
    public class AuthRepository : IAuthRepo
    {
        private readonly ApplicationDbContext _context;

        public AuthRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User?> FetchByEmail(string email)
        {   
            return await _context.Users.FirstOrDefaultAsync(x=>x.userEmail==email);
        
        }
    }
}