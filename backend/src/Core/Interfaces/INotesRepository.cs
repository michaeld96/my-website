using System;
using Core.Models;

namespace Core.Interfaces;

public interface INotesRepository
{
    public Task<User?> GetUserOrNullAsync(string username, CancellationToken ct);
    public Task<List<School>> GetListOfSchoolsOrNullAsync(CancellationToken ct);
    public Task<List<Subject>> GetListOfSubjectsOrNullAsync(string schoolCode, CancellationToken ct);
    public Task<bool> DoesSchoolExistAsync(string schoolCode, CancellationToken ct);
    public Task<bool> DoesSchoolExistForSubjectAsync(string schoolCode, CancellationToken ct);
    public Task<List<string>> GetAllNoteTitlesAsync(string schoolCode, string subjectCode, CancellationToken ct);
    public Task<List<Note>> GetAllNotesAssociatedWithSubjectAndSchoolAsync(string schoolCode, string subjectCode, CancellationToken ct);
    public Task<Note?> GetNoteAsync(string schoolCode, string subjectCode, string noteTitle, CancellationToken ct);
    public Task<Note?> GetNoteWithTrackingAsync(string schoolCode, string subjectCode, string noteTitle, CancellationToken ct);
    public Task<Note> AddNoteAsync(Note note, CancellationToken ct);

}
