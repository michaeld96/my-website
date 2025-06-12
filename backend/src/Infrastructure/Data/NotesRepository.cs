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
    public NotesRepository(NotesContext context) => _context = context;

    /// <summary>
    /// TODO: Write this out. Note to self, don't need async if you're just doing one thing, no 
    /// need to wait for the process to finish.
    /// </summary>
    /// <param name="username"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    public Task<User?> GetUserOrNullAsync(string username, CancellationToken ct)
    {
        return _context.Users
                             .AsNoTracking()
                             .SingleOrDefaultAsync(u => u.Username == username, ct);
    }
    public Task<List<School>> GetListOfSchoolsOrNullAsync(CancellationToken ct)
    {
        return _context.Schools
                       .AsNoTracking()
                       .ToListAsync(ct);
    }

    public Task<List<Subject>> GetListOfSubjectsOrNullAsync(string schoolCode, CancellationToken ct)
    {
        return _context.Subjects
                       .AsNoTracking()
                       .Where(s => s.School.Code == schoolCode)
                       .ToListAsync(ct);
    }
    public Task<bool> DoesSchoolExistAsync(string schoolCode, CancellationToken ct)
    {
        return _context.Schools
                       .AsNoTracking()
                       .AnyAsync(s => s.Code == schoolCode);

    }
    public Task<bool> DoesSchoolExistForSubjectAsync(string schoolCode, CancellationToken ct)
    {
        return _context.Subjects
                       .AsNoTracking()
                       .AnyAsync(s => s.School.Code == schoolCode, ct);
    }
    public Task<List<string>> GetAllNoteTitlesAsync(string schoolCode, string subjectCode, CancellationToken ct)
    {
        return _context.Notes
                       .AsNoTracking()
                       .Where(n => n.Subject.Code == subjectCode && n.Subject.School.Code == schoolCode)
                       .Select(n => n.Title)
                       .ToListAsync();
    }
    public Task<List<Note>> GetAllNotesAssociatedWithSubjectAndSchoolAsync(string schoolCode, string subjectCode, CancellationToken ct)
    {
        return _context.Notes
                       .AsNoTracking()
                       .Where(n => n.Subject.Code == subjectCode && n.Subject.School.Code == schoolCode)
                       .ToListAsync();
    }
    public Task<Note?> GetNoteAsync(string schoolCode, string subjectCode, string noteTitle, CancellationToken ct)
    {
        return _context.Notes
                       .AsNoTracking()
                       .Where(n => n.Subject.Code == subjectCode && n.Subject.School.Code == schoolCode && n.Title == noteTitle)
                       .FirstOrDefaultAsync();
    }
    public Task<Note?> GetNoteWithTrackingAsync(string schoolCode, string subjectCode, string noteTitle, CancellationToken ct)
    {
        return _context.Notes
                       .Where(n => n.Subject.Code == subjectCode && n.Subject.School.Code == schoolCode && n.Title == noteTitle)
                       .FirstOrDefaultAsync(ct);
    }
    public async Task<Note> AddNoteAsync(Note note, CancellationToken ct)
    {
        var entry = await _context.Notes.AddAsync(note, ct);
        return entry.Entity;
    }
}   