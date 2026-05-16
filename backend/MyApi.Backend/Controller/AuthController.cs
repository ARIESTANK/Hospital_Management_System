using Microsoft.AspNetCore.Mvc;
using MyApi.Backend.Models;
using MyApi.Backend.DTOs;
using MyApi.Backend.Services.Interfaces;

namespace MyApi.Backend.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> login([FromBody] LoginDto login)
        {
            var user = await _service.LoginService(login);
            if(user==null) return Unauthorized("Invalid credentials 2");
            else return Ok(user);
        }
        
    }
}