using System;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Core.Interfaces;

namespace Infrastructure.Services.Email;

public class SESService : IEmailService
{
    private readonly IAmazonSimpleEmailService _ses;
    private readonly EmailOptions _opt;
    public SESService(IAmazonSimpleEmailService ses, EmailOptions opt)
    {
        _ses = ses;
        _opt = opt;
    }
    public async Task SendContactEmailAsync(ContactEmail contactEmail, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(_opt.FromAddress))
        {
            throw new InvalidOperationException("ERROR: FromAddress from options must be populated.");
        }
        if (string.IsNullOrWhiteSpace(_opt.ToAddress))
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
            Source = _opt.FromAddress, // This will be the email that is shown to the user that it is from. This will be the email setup via the domain.
            Destination = new Destination
            {
                ToAddresses = new List<string> { _opt.ToAddress } // Inbox we are sending this email to.
            },
            Message = new Message
            {
                Subject = new Content(_opt.SubjectPrefix + contactEmail.Subject),
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
}
