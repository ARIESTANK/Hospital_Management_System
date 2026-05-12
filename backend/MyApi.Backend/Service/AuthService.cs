using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MyApi.Backend.DTOs;
using MyApi.Backend.Models;
using MyApi.Backend.Repositories.Interfaces;
using MyApi.Backend.Services.Interfaces;

namespace MyApi.Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepo;
        private readonly IConfiguration  _configuration;

        public AuthService(IUserRepository userRepo, IConfiguration configuration)
        {
            _userRepo      = userRepo;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
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

            return new AuthResponseDto
            {
                Token = GenerateJwtToken(created),
                User  = UserDto.FromEntity(created)
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userRepo.GetByEmailAsync(dto.Email)
                ?? throw new UnauthorizedAccessException("Invalid email or password.");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.userPassword))
                throw new UnauthorizedAccessException("Invalid email or password.");

            return new AuthResponseDto
            {
                Token = GenerateJwtToken(user),
                User  = UserDto.FromEntity(user)
            };
        }

        // ── Private ────────────────────────────────────────────────────────────

        private string GenerateJwtToken(User user)
        {
            var jwtKey    = _configuration["Jwt:Key"]    ?? throw new InvalidOperationException("JWT key not configured.");
            var jwtIssuer = _configuration["Jwt:Issuer"] ?? "MyApi";

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,   user.userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.userEmail),
                new Claim(ClaimTypes.NameIdentifier,     user.userId.ToString()),
                new Claim(ClaimTypes.Name,               user.userName ?? string.Empty),
                new Claim(ClaimTypes.Role,               user.userRole.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString())
            };

            var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer:             jwtIssuer,
                audience:           jwtIssuer,
                claims:             claims,
                expires:            DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}