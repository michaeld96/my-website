using System;
using System.ComponentModel.DataAnnotations;

namespace Core.Models;

public class User
{
    [Key]
    public int UserPK { get; set; }

    [StringLength(50)]
    required public string Username { get; set; }
    required public string PasswordHash { get; set; }
}
