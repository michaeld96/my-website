using System;
using System.ComponentModel.DataAnnotations;

namespace Core.Models;
/// <summary>
/// A model that will house the markdown file that is associated with this note.
/// School can be three things: UM for the University of Michigan, GT for Georgia Tech,
/// and NA for no school. Class will associate with the given class. Title will be
/// anything from a lecture to just random blogs. Content is the markdown file itself.
/// Tags is comma separated tags.
/// </summary>
public class Note
{
    [Key]
    public int NotePK { get; set; }
    required public string School { get; set; } // University of Michigan, Georgia Tech, .NET, Blog, ...
    required public string Subject { get; set; } // ex: "EECS 281: Data Structures and Algorithms."
    required public string Title { get; set; } // "ex: Lecture 1."
    required public string Content { get; set; } // "Markdown content."
    public string? Tags { get; set; }
}
