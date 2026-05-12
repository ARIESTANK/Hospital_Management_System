using MyApi.Backend.DTOs;
using MyApi.Backend.Enum;
using MyApi.Backend.Models;
using MyApi.Backend.Repositories.Interfaces;
using MyApi.Backend.Services.Interfaces;

namespace MyApi.Backend.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepo;

        public UserService(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            var users = await _userRepo.GetAllAsync();
            return users.Select(UserDto.FromEntity);
        }

        public async Task<UserDto> GetByIdAsync(int id, int requesterId, bool isAdmin)
        {
            if (!isAdmin && requesterId != id)
                throw new UnauthorizedAccessException("Access denied.");

            var user = await _userRepo.GetByIdAsync(id)
                ?? throw new KeyNotFoundException($"User with ID {id} not found.");

            return UserDto.FromEntity(user);
        }

        public async Task<UserDto> CreateAsync(CreateUserDto dto)
        {
            if (await _userRepo.EmailExistsAsync(dto.Email))
                throw new InvalidOperationException("Email already in use.");

            var user = new User
            {
                userName     = dto.UserName,
                userEmail    = dto.Email,
                userPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                userRole     = dto.Role
            };

            var created = await _userRepo.CreateAsync(user);
            return UserDto.FromEntity(created);
        }

        public async Task<UserDto> UpdateAsync(int id, UpdateUserDto dto, int requesterId, bool isAdmin)
        {
            if (!isAdmin && requesterId != id)
                throw new UnauthorizedAccessException("Access denied.");

            var user = await _userRepo.GetByIdAsync(id)
                ?? throw new KeyNotFoundException($"User with ID {id} not found.");

            if (!string.IsNullOrWhiteSpace(dto.UserName))
                user.userName = dto.UserName;

            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                if (await _userRepo.EmailExistsAsync(dto.Email, excludeId: id))
                    throw new InvalidOperationException("Email already in use.");

                user.userEmail = dto.Email;
            }

            if (!string.IsNullOrWhiteSpace(dto.Password))
                user.userPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            if (dto.Role.HasValue)
            {
                if (!isAdmin)
                    throw new UnauthorizedAccessException("Only ADMIN can change user roles.");

                user.userRole = dto.Role.Value;
            }

            var updated = await _userRepo.UpdateAsync(user);
            return UserDto.FromEntity(updated);
        }

        public async Task DeleteAsync(int id)
        {
            var user = await _userRepo.GetByIdAsync(id)
                ?? throw new KeyNotFoundException($"User with ID {id} not found.");

            await _userRepo.DeleteAsync(user);
        }

        public async Task<IEnumerable<UserDto>> GetByRoleAsync(Role role)
        {
            var users = await _userRepo.GetByRoleAsync(role);
            return users.Select(UserDto.FromEntity);
        }
    }
}