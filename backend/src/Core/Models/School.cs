using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Models;

public class School
{
    public int Id { get; set; } // PK.
    public string Code { get; set; } = null!; // UM, GT, etc.
    public string Name { get; set; } = null!; // Name of the school.
    public ICollection<Subject> Subjects { get; set; } = new List<Subject>();
}
