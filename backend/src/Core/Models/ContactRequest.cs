using System;

namespace Core.Models;

public class ContactRequest
{
    public string Sender { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string CaptchaToken { get; set; } = string.Empty;
}
