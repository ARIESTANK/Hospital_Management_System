using MyApi.Backend.Enum;
using MyApi.Backend.Models;

namespace MyApi.Backend.DTOs
{
    public class UserDto
    {
        public int    UserId    { get; set; }
        public string UserName  { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string UserRole  { get; set; } = string.Empty;

        public static UserDto FromEntity(User u) => new()
        {
            UserId    = u.userId,
            UserName  = u.userName  ?? string.Empty,
            UserEmail = u.userEmail,
            UserRole  = u.userRole.ToString()
        };
    }

    public class CreateUserDto
    {
        public required string UserName { get; set; }
        public required string Email    { get; set; }
        public required string Password { get; set; }
        public required string   Role     { get; set; }

        public required string UserGender { get; set; }
    }

    public class UpdateUserDto
    {
        public string? UserName { get; set; }
        public string? Email    { get; set; }
        public string? Password { get; set; }
        public Role?   Role     { get; set; }   // ADMIN only
        public Gender? UserGender { get; set; }
    }
}