using System;

namespace Core.Models;

public class NoteUpdateDTO
{
    public DateTime UpdatedAt { get; set; }
    public string Markdown { get; set; } = "";
}
