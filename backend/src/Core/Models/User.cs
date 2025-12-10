using System;
using System.ComponentModel.DataAnnotations;

namespace Core.Models;

public class User
{
    public int Id { get; set; }
    required public string Username { get; set; }
    required public string PasswordHash { get; set; }
    public ICollection<PasswordResetRequest> PasswordResetRequests { get; set; } = new List<PasswordResetRequest>(); // one user -> many passwordResetRequests.
}
