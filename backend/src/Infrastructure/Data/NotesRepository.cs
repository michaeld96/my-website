using System;
using Core.Interfaces;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Data;

// TODO: Need to finish this and replace the context in NotesController.
public class NotesRepository : INotesRepository
{
    private readonly NotesContext _context;
    public NotesRepository(NotesContext context)
    {
        _context = context;
    }
    /// <summary>
    /// Returns a note, and if no note can be found this will return null.
    /// </summary>
    /// <param name="school"></param>
    /// <param name="subject"></param>
    /// <param name="title"></param>
    /// <returns>`Note` if note is found otherwise `null`.</returns>
    public async Task<Note?> GetNoteAsync(string school, string subject, string title)
    {
        if (school.IsNullOrEmpty() || subject.IsNullOrEmpty() || title.IsNullOrEmpty())
        {
            return null;
        }

        return await _context.Notes
            .FirstOrDefaultAsync(
                n =>
                    n.School == school &&
                    n.Subject == subject &&
                    n.Title == title
        );
    }
}