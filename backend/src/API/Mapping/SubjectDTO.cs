using System;

namespace Core.Models;

public class SubjectDTO
{
    public string Title { get; set; } = null!; 
    public string Code { get; set; } = null!;
    public int SchoolId { get; set; } // FK.
}
