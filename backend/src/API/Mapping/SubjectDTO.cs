using System;

namespace Core.Models;

public class SubjectDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = null!; 
    public string Code { get; set; } = null!;
    public int SchoolId { get; set; } // FK.
}
