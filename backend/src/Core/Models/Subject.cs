using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Models;

public class Subject
{
    public int Id { get; set; }
    public string Title { get; set; } = null!; // Title of the class like "EECS 483".
    public int SchoolId { get; set; } // FK.
    public School School { get; set; } = null!; // Navigation, let's us traverse the object (inverse navigation).
    public ICollection<Note> Notes { get; set; } = new List<Note>(); // Using EF, let's us see all the Notes with this subject.
}
