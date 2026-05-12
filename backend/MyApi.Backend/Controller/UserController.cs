using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApi.Backend.DTOs;
using MyApi.Backend.Enum;
using MyApi.Backend.Services.Interfaces;
using System.Security.Claims;

namespace MyApi.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // GET api/user
        // ADMIN → all users | others → own record only (enforced in service)
        [HttpGet]
        [Authorize(Roles = "ADMIN,RECEPTIONIST,CLINIC,DOCTOR")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                if (IsAdmin())
                {
                    var all = await _userService.GetAllAsync();
                    return Ok(all);
                }

                // Non-admin: redirect to own record
                var self = await _userService.GetByIdAsync(GetCurrentUserId(), GetCurrentUserId(), isAdmin: false);
                return Ok(new[] { self });
            }
            catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
            catch (KeyNotFoundException ex)        { return NotFound(new { message = ex.Message }); }
        }

        // GET api/user/{id}
        [HttpGet("{id:int}")]
        [Authorize(Roles = "ADMIN,RECEPTIONIST,CLINIC,DOCTOR")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var user = await _userService.GetByIdAsync(id, GetCurrentUserId(), IsAdmin());
                return Ok(user);
            }
            catch (UnauthorizedAccessException) { return Forbid(); }
            catch (KeyNotFoundException ex)     { return NotFound(new { message = ex.Message }); }
        }

        // POST api/user  — ADMIN only
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
        {
            try
            {
                var created = await _userService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.UserId }, created);
            }
            catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
        }

        // PUT api/user/{id}
        // ADMIN → update anyone + role | others → update own name/email/password only
        [HttpPut("{id:int}")]
        [Authorize(Roles = "ADMIN,RECEPTIONIST,CLINIC,DOCTOR")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
        {
            try
            {
                var updated = await _userService.UpdateAsync(id, dto, GetCurrentUserId(), IsAdmin());
                return Ok(updated);
            }
            catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
            catch (KeyNotFoundException ex)        { return NotFound(new { message = ex.Message }); }
            catch (InvalidOperationException ex)   { return Conflict(new { message = ex.Message }); }
        }

        // DELETE api/user/{id}  — ADMIN only
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _userService.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        }

        // GET api/user/by-role/{role}  — ADMIN, RECEPTIONIST
        [HttpGet("by-role/{role}")]
        [Authorize(Roles = "ADMIN,RECEPTIONIST")]
        public async Task<IActionResult> GetByRole(Role role)
        {
            var users = await _userService.GetByRoleAsync(role);
            return Ok(users);
        }

        // ── Helpers ────────────────────────────────────────────────────────────

        private int GetCurrentUserId()
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? User.FindFirstValue("sub")
                   ?? throw new UnauthorizedAccessException("User identity not found.");

            return int.Parse(sub);
        }

        private bool IsAdmin()
            => User.IsInRole(Role.ADMIN.ToString());
    }
}