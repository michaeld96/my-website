using System;

namespace Core.Models;

public class NoteUpdateDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public DateTime UpdatedAt { get; set; }
    public string Markdown { get; set; } = "";
}
