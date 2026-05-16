using Microsoft.AspNetCore.Mvc;
using MyApi.Backend.Models;
using MyApi.Backend.DTOs;
using MyApi.Backend.Services.Interfaces;

namespace MyApi.Backend.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userservice;

        public UserController(IUserService userservice)
        {
            _userservice = userservice;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> getUserById(int id)
        {
            var user = await _userservice.FindById(id);
            if(user == null) return NotFound("User Not Found");
            else return Ok(user);
        }

        [HttpGet("all")]
        public async Task<IActionResult> getAllUsers(){
            var users = await _userservice.GetAllUsers();
            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> createUser([FromBody] CreateUserDto dto)
        {
            var createdUser = await _userservice.CreateUser(dto);
            if(createdUser == null ) return BadRequest("User Creation Failed");
            else return Ok(createdUser);
        }

        



        
    }
}