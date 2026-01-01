using System;

namespace Infrastructure.Services.Email;

public sealed class EmailOptions
{
    /// <summary>
    /// Where Email is from, i.e., <c>no-reply@example.com</c>
    /// </summary>
    public string FromAddress { get; set; } = "";
    /// <summary>
    /// Where email is sent to, i.e., <c>my-email@example.com</c>
    /// </summary>
    public string ToAddress { get; set; } = "";
    /// <summary>
    /// Prefix to help organize emails from site.
    /// </summary>
    public string SubjectPrefix { get; set; } = "";
}
