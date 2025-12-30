using System;

namespace Infrastructure.Services.Email;

public sealed class EmailOptions
{
    /// <summary>
    /// Verified SES identity email.
    /// </summary>
    public string FromAddress { get; set; } = "";
    /// <summary>
    /// Where the contact form should go.
    /// </summary>
    public string ToAddress { get; set; } = "";
    /// <summary>
    /// Prefix to help organize emails from site.
    /// </summary>
    public string SubjectPrefix { get; set; } = "[Contact]";
}
