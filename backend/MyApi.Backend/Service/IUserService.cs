using MyApi.Backend.DTOs;
using MyApi.Backend.Enum;

namespace MyApi.Backend.Services.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<UserDto>              GetByIdAsync(int id, int requesterId, bool isAdmin);
        Task<UserDto>              CreateAsync(CreateUserDto dto);
        Task<UserDto>              UpdateAsync(int id, UpdateUserDto dto, int requesterId, bool isAdmin);
        Task                       DeleteAsync(int id);
        Task<IEnumerable<UserDto>> GetByRoleAsync(Role role);
    }
}