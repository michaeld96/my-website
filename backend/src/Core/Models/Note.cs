using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Models;

public class Note
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Title { get; set; } = null!;
    public string Markdown { get; set; } = "";
    public DateTime UpdatedAt { get; set; }
    public ICollection<Tag> Tags { get; set; } = new List<Tag>(); // Many-to-many, EF will give us a TagsNote table.
    public int SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;
    
}
