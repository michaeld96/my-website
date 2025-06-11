using System;

namespace Core.Models;

public class SchoolDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = null!; // Title of the subject, like, "Compilers".
    public string Code { get; set; } = null!; // EECS 483.
    public int SchoolId { get; set; } // FK.
}
