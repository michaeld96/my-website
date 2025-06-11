using System;

namespace Core.Models;

public class NoteDTO
{
    public string Title { get; set; } = null!;
    public string Markdown { get; set; } = "";
    public int SubjectId { get; set; }
}
