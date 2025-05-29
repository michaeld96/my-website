using System;
using System.ComponentModel.DataAnnotations;

namespace Core.Models;

public class Tag
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public ICollection<Note> Notes { get; set; } = new List<Note>();
}
