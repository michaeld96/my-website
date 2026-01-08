using System;
using Core.Models;

namespace Core.Interfaces;

public interface INotesRepository
{
    public Task<User?> GetUserOrNullAsync(string username, CancellationToken ct);
    /// <summary>
    /// Fetches User by Id. 
    /// </summary>
    /// <param name="userId">Id of the user.</param>
    /// <param name="ct">Cancellation Token.</param>
    /// <returns><c>User</c> or <c>null</c>.</returns>
    public Task<User?> GetUserByIdOrNullAsync(int userId, CancellationToken ct);
    /// <summary>
    /// Returns a list of schools alphabetically.
    /// </summary>
    /// <param name="ct"></param>
    /// <returns>List of type <c>School</c>.</returns>
    public Task<List<School>> GetListOfSchoolsOrNullAsync(CancellationToken ct);
    /// <summary>
    /// Returns the list of subjects that are associated with a school. Subjects are ordered alphabetically.
    /// </summary>
    /// <param name="schoolId"></param>
    /// <param name="ct"></param>
    /// <returns>List of type <c>Subject</c>.</returns>
    public Task<List<Subject>> GetListOfSubjectsOrNullAsync(int schoolId, CancellationToken ct);
    public Task<bool> DoesSchoolExistAsync(int schoolId, CancellationToken ct);
    public Task<bool> DoesSchoolExistForSubjectAsync(int schoolId, CancellationToken ct);
    public Task<List<Note>> GetAllNotesAsync(int schoolId, int subjectId, CancellationToken ct);
    public Task<List<Note>> GetAllNotesAssociatedWithSubjectAndSchoolAsync(string schoolCode, string subjectCode, CancellationToken ct);
    public Task<Note?> GetNoteAsync(int schoolId, int subjectId, int noteId, CancellationToken ct);
    public Task<Note?> GetNoteWithTrackingAsync(int noteId, CancellationToken ct);
    public Task<Note> AddNoteAsync(Note note, CancellationToken ct);
    public Task<Subject> AddSubjectAsync(Subject subject, CancellationToken ct);
    public Task<Subject?> GetSubjectWithTrackingAsync(int subjectId, CancellationToken ct);
    public void DeleteSubject(Subject subject);
    public void DeleteNote(Note note);
    public Task<School> AddSchoolAsync(School school, CancellationToken ct);
    public Task<School?> GetSchoolWithTrackingAsync(int schoolId, CancellationToken ct);
    public void DeleteSchool(School school);
    public Task<List<Subject>> GetAllSubjects();
    public Task<PasswordResetRequest> AddPasswordResetRequestAsync(PasswordResetRequest prr, CancellationToken ct);
    /// <summary>
    /// Returns a <c>PasswordResetRequest</c> if one exists. Is queried by the token after it is hashed.
    /// </summary>
    /// <param name="tokenHash">A hashed token that is hashed by <c>BCrypt</c></param>
    /// <param name="ct">Cancellation Token</param>
    /// <returns>The <c>PasswordResetRequest</c> or null.</returns>
    public Task<PasswordResetRequest?> GetPasswordResetRequestAsync(string tokenHash, CancellationToken ct);
}
