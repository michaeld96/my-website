using System;

namespace Core.Models;

public class SchoolDTO
{
    public int Id { get; set; }
    public string Code { get; set; } = null!; // Title of the subject, like, "Compilers".
    public string Name { get; set; } = null!; // EECS 483.
}
