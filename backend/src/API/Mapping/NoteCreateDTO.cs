using System;

namespace API.Mapping;

public class NoteCreateDTO
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Title { get; set; } = null!;
    public string Markdown { get; set; } = "";
    public int SubjectId { get; set; }
}
