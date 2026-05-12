using MyApi.Backend.Enum;

namespace MyApi.Backend.DTOs
{
    public class RegisterDto
    {
        public required string UserName { get; set; }
        public required string Email    { get; set; }
        public required string Password { get; set; }
        public required Role   Role     { get; set; }
    }

    public class LoginDto
    {
        public required string Email    { get; set; }
        public required string Password { get; set; }
    }

    public class AuthResponseDto
    {
        public string     Token { get; set; } = string.Empty;
        public UserDto    User  { get; set; } = null!;
    }
}