using Microsoft.EntityFrameworkCore;
using MyApi.Backend.Context;
using MyApi.Backend.Models;
using MyApi.Backend.Repository.Interface;
using MyApi.Backend.DTOs;
namespace MyApi.Backend.Repositories
{
    public class UserRepository : IUserRepo
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User> CreateUser(User user)
        {   
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User?> FindByEmail(string email)
        {
            var existUser = await _context.Users.FirstOrDefaultAsync(x=>x.userEmail==email);
            return existUser;
        }

        public async Task<User?> FindById(int id)
        {
            var existUser = await _context.Users.FindAsync(id);
            return existUser;
        }

        public async Task<List<User>> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            return users;
        }
    }
}