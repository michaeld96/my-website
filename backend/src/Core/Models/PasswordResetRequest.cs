using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.Contracts;

namespace Core.Models;

public class PasswordResetRequest
{
    public int Id { get; set; }                     // PK.
    public int UserId { get; set; }                 // FK to User.
    [MaxLength(64)]
    required public string Selector { get; set; } // This is used to Index on the Password reset request.
    [MaxLength(128)]
    required public string TokenHash { get; set; }  // validator hash.
    public DateTime CreatedAtUtc { get; set; }
    public DateTime ExpiresAtUtc { get; set; }     
    public DateTime? UsedAtUtc { get; set; }        // Mark time that the token was used.
    [NotMapped]
    public bool IsUsed => UsedAtUtc != null;
    public User User { get; set; } = null!;         // navigate back to the user.
}
