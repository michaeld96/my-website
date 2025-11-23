using Core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;
        public ContactController(IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _httpClientFactory = httpClientFactory;
            _config = config;
        }

        [HttpPost]
        public async Task<IActionResult> VerifyCaptcha([FromBody] ContactRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Subject) ||
                string.IsNullOrWhiteSpace(request.Sender)  ||
                string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new { message = "Subject, Sending, and Message must be present." });
            }

            if (string.IsNullOrWhiteSpace(request.CaptchaToken))
            {
                return BadRequest(new { message = "CAPTCHA must be present." });
            }

            // Ping Google and see if the CAPTCHA is the same.
            var recaptchaSecret = _config["RECAPTCHA_SECRET"]; // Getting variable from launchSettings.json
            if (string.IsNullOrEmpty(recaptchaSecret))
            {
                return StatusCode(500, new { message = "CAPTCHA not configured." });
            }

            var client = _httpClientFactory.CreateClient();
            var response = await client.PostAsync(
                "https://www.google.com/recaptcha/api/siteverify",
                new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("secret", recaptchaSecret),
                    new KeyValuePair<string, string>("response", request.CaptchaToken)
                })
            );

            var json = await response.Content.ReadAsStringAsync();
            var recaptchaResult = System.Text.Json.JsonSerializer.Deserialize<RecaptchaResponse>(json,
                new System.Text.Json.JsonSerializerOptions
                {
                   PropertyNameCaseInsensitive = true 
                });
            
            if (recaptchaResult == null || !recaptchaResult.Success)
            {
                return BadRequest(new {message = "CAPTCHA validation failed."});
            }

            // TODO: Send email.

            return Ok( new { message = "Message sent successfully." });
        }
    }
}
