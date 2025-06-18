using System;
using Core.Models;

namespace Core.Interfaces;

public interface INotesRepository
{
    public Task<User?> GetUserOrNullAsync(string username, CancellationToken ct);
    public Task<List<School>> GetListOfSchoolsOrNullAsync(CancellationToken ct);
    public Task<List<Subject>> GetListOfSubjectsOrNullAsync(int schoolId, CancellationToken ct);
    public Task<bool> DoesSchoolExistAsync(int schoolId, CancellationToken ct);
    public Task<bool> DoesSchoolExistForSubjectAsync(int schoolId, CancellationToken ct);
    public Task<List<Note>> GetAllNotesAsync(int schoolId, int subjectId, CancellationToken ct);
    public Task<List<Note>> GetAllNotesAssociatedWithSubjectAndSchoolAsync(string schoolCode, string subjectCode, CancellationToken ct);
    public Task<Note?> GetNoteAsync(int schoolId, int subjectId, int noteId, CancellationToken ct);
    public Task<Note?> GetNoteWithTrackingAsync(int noteId, CancellationToken ct);
    public Task<Note> AddNoteAsync(Note note, CancellationToken ct);
    public void DeleteNote(Note note);

}
