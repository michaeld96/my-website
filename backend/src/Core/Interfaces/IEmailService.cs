using System;

namespace Core.Interfaces;

public interface IEmailService
{
    /// <summary>
    /// Sends email to the recipient specified in the <c>ContactEmail</c>.
    /// </summary>
    Task SendContactEmailAsync(ContactEmail contactEmail, CancellationToken ct);
}

/// <summary>
/// ContactEmail that is sent via the SES AWS SDK.
/// </summary>
/// <param name="FromEmail">The email of the sender.</param>
/// <param name="Subject">Subject of email.</param>
/// <param name="Message">Email Message</param>
/// <param name="UserAgent"></param>
/// <param name="RemoteIp"></param>
// Note to self, record is a special type of class and sealed doesn't allow other classes to inherit this.
public sealed record ContactEmail( 
    string FromEmail,
    string ToEmail,
    string Subject,
    string Message,
    string? UserAgent,
    string? RemoteIp
);
