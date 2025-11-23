using System;

namespace Core.Models;

public class RecaptchaResponse
{
    public bool Success { get; set; }
    public DateTime ChallengeTs { get; set; }
    public string hostname { get; set; } = string.Empty;
    public List<string> ErrorCodes { get; set; } = new();

}
