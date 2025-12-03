using System;
using System.Diagnostics.Contracts;

namespace Core.Models;

public class PasswordResetRequest
{
    public int Id { get; set; }                     // PK.
    public int UserId { get; set; }                 // FK to User.
    required public string TokenHash { get; set; }  // hashed reset token.
    public DateTime ExpiresAtUtc { get; set; }     
    public DateTime? UsedAtUtc { get; set; }        // Mark time that the token was used.
    public User User { get; set; } = null!;         // navigate back to the user.
}
