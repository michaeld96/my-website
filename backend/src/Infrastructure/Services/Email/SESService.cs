using System;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Core.Interfaces;

namespace Infrastructure.Services.Email;

public class SESService : IEmailService
{
    private readonly IAmazonSimpleEmailService _ses;
    public SESService(IAmazonSimpleEmailService ses)
    {
        _ses = ses;
    }
    public async Task SendContactEmailAsync(ContactEmail contactEmail, CancellationToken ct)
    {
        string? baseUrl = Environment.GetEnvironmentVariable("DOMAIN_NAME");
        if (baseUrl == null)
        {
            throw new InvalidCastException("SESService: EmailOptions must have a failed ToAddress and FromAddress.");
        }
        EmailOptions opt = new EmailOptions
        {
            ToAddress = $"me@{Environment.GetEnvironmentVariable("DOMAIN_NAME")}",
            FromAddress = $"contact@{Environment.GetEnvironmentVariable("DOMAIN_NAME")}",
            SubjectPrefix = "[Contact]"
        };

        if (string.IsNullOrWhiteSpace(opt.FromAddress))
        {
            throw new InvalidOperationException("ERROR: FromAddress from options must be populated.");
        }
        if (string.IsNullOrWhiteSpace(opt.ToAddress))
        {
            throw new InvalidOperationException("ERROR: ToAddress from options must be populated.");
        }

        string body = $"""
        New contact form submission!

        From: {contactEmail.FromEmail}
        Subject: {contactEmail.Subject}
        Remote IP: {contactEmail.RemoteIp}
        User Agent: {contactEmail.UserAgent}

        Message:
        {contactEmail.Message}
        """;

        var emailRequest = new SendEmailRequest
        {
            Source = opt.FromAddress, // This will be the email that is shown to the user that it is from. This will be the email setup via the domain.
            Destination = new Destination
            {
                ToAddresses = new List<string> { opt.ToAddress } // Inbox we are sending this email to.
            },
            Message = new Message
            {
                Subject = new Content(opt.SubjectPrefix + contactEmail.Subject),
                Body = new Body
                {
                    Text = new Content(body)
                }
            },
            ReplyToAddresses = new List<string> {contactEmail.FromEmail} // Easy way to reply to the sender.
        };
        try
        {
            await _ses.SendEmailAsync(emailRequest, ct);   
        }
        catch (Exception e)
        {
            throw new Exception($"ERROR: SendEmailAsync failed with the following exception: {e.Message}");
        }
    }
    public async Task SendPasswordResetAsync(string email, string resetUrl, CancellationToken ct)
    {
        string? baseUrl = Environment.GetEnvironmentVariable("DOMAIN_NAME");
        if (baseUrl == null)
        {
            throw new InvalidCastException("SESService: EmailOptions must have a failed ToAddress and FromAddress.");
        }
        EmailOptions opt = new EmailOptions
        {
            FromAddress = $"no-reply@{Environment.GetEnvironmentVariable("DOMAIN_NAME")}",
            SubjectPrefix = "[PasswordReset]"
        };

        string message = $"""
        Hello! Your password reset request is here! 

        Please, visit this link to reset your password: {resetUrl}

        Thanks,
        Michael
        """;
        var emailRequest = new SendEmailRequest
        {
            Source = opt.FromAddress,
            Destination = new Destination
            {
                ToAddresses = new List<string> { email }
            },
            Message = new Message
            {
                Subject = new Content(opt.SubjectPrefix),
                Body = new Body
                {
                    Text = new Content(message)
                }
            }
        };
        try
        {
            await _ses.SendEmailAsync(emailRequest, ct);
        }
        catch (Exception e)
        {
            throw new Exception($"ERROR: SendEmailAsync failed with the following exception: {e.Message}");
        }
    }
}
