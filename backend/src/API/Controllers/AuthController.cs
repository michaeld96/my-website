using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.Mapping;
using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
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
        private readonly IEmailService _ses;

        public AuthController(IUnitOfWork uow, IConfiguration config, IEmailService ses)
        {
            _uow = uow;
            _config = config;
            _ses = ses;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
        {
            if (request == null || request.Username == null)
            {
                return BadRequest("Auth: request was empty");
            }

            var user = await GetUser(request.Username, ct);
            if (user == null || user.Username == null || user.PasswordHash == null || request.Password == null)
            {
                return BadRequest("Auth: Cannot find user to assign JWT to.");
            }

            bool isPasswordValid;
            isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                return Unauthorized("Invalid username or password.");
            }

            // Create JWT.
            var token = GenerateJwtToken(user.Username);
            if (token == null)
            {
                return StatusCode(500, "JWT Config: Configuration missing (Issuer, Audience, Secret)");
            }
            else
            {
                return Ok(new { token });
            }

        }
        [HttpGet("me")]
        [Authorize]
        public IActionResult ValidateUser()
        {
            var username = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                            ?? User.Identity?.Name
                            ?? string.Empty;
            return Ok(new { username });
        }
        /// <summary>
        /// This function will search the database and see if a username does exist, and if it does it will send
        /// an email to that user with token attached via URL to reset password along with the page to reset their password.
        /// </summary>
        /// /// <param name="username"></param>
        /// <returns>Status Code 200 or 400</returns>
        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] PasswordResetRequestDTO username, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(username.Email))
            {
                return BadRequest("Auth: Username is empty or null.");
            }
            var user = await GetUser(username.Email, ct);
            if (user == null)
            {
                return Ok("If username is found a link to reset password has been sent!");
            }
            // Creating token to be stored and sent to the user.
            var tokenBytes = System.Security.Cryptography.RandomNumberGenerator.GetBytes(32);
            var token = Convert.ToBase64String(tokenBytes);
            var tokenHash = BCrypt.Net.BCrypt.HashPassword(token);
            // Going to create the password reset and save it to the db.
            PasswordResetRequest passwordResetRequest = new PasswordResetRequest
            {
                UserId = user.Id,
                TokenHash = tokenHash,
                CreatedAtUtc = DateTime.UtcNow,
                ExpiresAtUtc = DateTime.UtcNow.AddMinutes(15)
            };
            await _uow.NotesRepo.AddPasswordResetRequestAsync(passwordResetRequest, ct);
            await _uow.CommitAsync(ct);
            var resetBaseUrl = Environment.GetEnvironmentVariable("PASSWORD_RESET_URL") ?? "";
            if (string.IsNullOrEmpty(resetBaseUrl))
            {
                return StatusCode(500, "Auth: Error with resetPasswordUrl! Is null or empty.");
            }
            string resetPasswordUrl = $"{resetBaseUrl}?token={Uri.EscapeDataString(token)}";
            await _ses.SendPasswordResetAsync(username.Email, resetPasswordUrl, ct);
            return Ok("If username is found a link to reset password has been sent!");
        }

        private Task<User?> GetUser(string username, CancellationToken ct)
        {
            return _uow.NotesRepo.GetUserOrNullAsync(username, ct);
        }

        private string? GenerateJwtToken([FromBody] string username)
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var jwtSecret = _config["JwtSettings:Secret"] ?? Environment.GetEnvironmentVariable("JWT_SECRET");
            var issuer = _config["JwtSettings:Issuer"] ?? Environment.GetEnvironmentVariable("JWT_ISSUER");
            var audience = _config["JwtSettings:Audience"] ?? Environment.GetEnvironmentVariable("JWT_AUDIENCE");

            if (string.IsNullOrWhiteSpace(issuer) || string.IsNullOrWhiteSpace(audience) || string.IsNullOrWhiteSpace(jwtSecret))
            {
                return null;
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
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
