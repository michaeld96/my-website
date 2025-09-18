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

    public Task<List<Subject>> GetListOfSubjectsOrNullAsync(int schoolId, CancellationToken ct)
    {
        return _context.Subjects
                       .AsNoTracking()
                       .Where(s => s.School.Id == schoolId)
                       .ToListAsync(ct);
    }
    public Task<bool> DoesSchoolExistAsync(int schoolId, CancellationToken ct)
    {
        return _context.Schools
                       .AsNoTracking()
                       .AnyAsync(s => s.Id == schoolId);

    }
    public Task<bool> DoesSchoolExistForSubjectAsync(int schoolId, CancellationToken ct)
    {
        return _context.Subjects
                       .AsNoTracking()
                       .AnyAsync(s => s.School.Id == schoolId, ct);
    }
    public Task<List<Note>> GetAllNotesAsync(int schoolId, int subjectId, CancellationToken ct)
    {
        return _context.Notes
                       .AsNoTracking()
                       .Where(n => n.Subject.Id == subjectId && n.Subject.School.Id == schoolId)
                       .ToListAsync();
    }
    public Task<List<Note>> GetAllNotesAssociatedWithSubjectAndSchoolAsync(string schoolCode, string subjectCode, CancellationToken ct)
    {
        return _context.Notes
                       .AsNoTracking()
                       .Where(n => n.Subject.Code == subjectCode && n.Subject.School.Code == schoolCode)
                       .ToListAsync();
    }
    public Task<Note?> GetNoteAsync(int schoolId, int subjectId, int noteId, CancellationToken ct)
    {
        return _context.Notes
                       .AsNoTracking()
                       .Where(n => n.Subject.Id == subjectId && n.Subject.School.Id == schoolId && n.Id == noteId)
                       .FirstOrDefaultAsync();
    }
    public Task<Note?> GetNoteWithTrackingAsync(int noteId, CancellationToken ct)
    {
        return _context.Notes
                       .Where(n => n.Id == noteId)
                       .FirstOrDefaultAsync(ct);
    }
    public async Task<Note> AddNoteAsync(Note note, CancellationToken ct)
    {
        var entry = await _context.Notes.AddAsync(note, ct);
        return entry.Entity;
    }
    public void DeleteNote(Note note)
    {
        _context.Remove(note);
    }
    public async Task<Subject> AddSubjectAsync(Subject subject, CancellationToken ct)
    {
        var entity = await _context.AddAsync(subject, ct);
        return entity.Entity;
    }

    public Task<Subject?> GetSubjectWithTrackingAsync(int subjectId, CancellationToken ct)
    {
        return _context.Subjects
                        .Where(s => s.Id == subjectId)
                        .FirstOrDefaultAsync(ct);
    }

    public void DeleteSubject(Subject subject)
    {
        _context.Subjects.Remove(subject);
    }

    public async Task<School> AddSchoolAsync(School school, CancellationToken ct)
    {
        var entity = await _context.Schools.AddAsync(school, ct);
        return entity.Entity;
    }

    public Task<School?> GetSchoolWithTrackingAsync(int schoolId, CancellationToken ct)
    {
        return _context.Schools
                        .Where(s => s.Id == schoolId)
                        .FirstOrDefaultAsync(ct);
    }

    public void DeleteSchool(School school)
    {
        _context.Remove(school);
    }

    public Task<List<Subject>> GetAllSubjects()
    {
        return _context.Subjects.ToListAsync();
    }
}   