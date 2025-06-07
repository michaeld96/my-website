using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _env;

        public AuthController(IUnitOfWork uow, IConfiguration config, IWebHostEnvironment env)
        {
            _uow = uow;
            _config = config;
            _env = env;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
        {
            if (request == null)
            {
                return BadRequest("Auth: request was empty");
            }
            var user = await _uow.NotesRepo.GetUserOrNullAsync(request.Username, ct);
            if (user == null)
            {
                return BadRequest("Auth: Cannot find user to assign JWT to.");
            }

            bool isPasswordValid;
            if (_env.IsDevelopment())
            {
                // In development, compare the plain text password directly.
                isPasswordValid = request.Password == user?.PasswordHash;
            }
            else
            {
                // In other environments, use BCrypt to verify the password.
                isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user?.PasswordHash);
            }

            if (!isPasswordValid)
            {
                return Unauthorized("Invalid username or password.");
            }

            // Create JWT.
            var token = GenerateJwtToken(user.Username);
            return Ok(new { token });

        }

        private string GenerateJwtToken(string username)
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            string jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? String.Empty;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

public class LoginRequest 
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}
