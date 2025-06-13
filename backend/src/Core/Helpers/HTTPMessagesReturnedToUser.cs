using System;

namespace Core.Helpers;

public static class HTTPMessagesReturnedToUser
{
    public static string SchoolNotFoundErrorMessage<T>(T schoolCode)
    {
        return $"ERROR: School, {schoolCode}, does not exists.";
    }
    public static string SchoolNotSpecifiedErrorMessage()
    {
        return "ERROR: No school was specified.";
    }
    public static string SchoolOrSubjectOrNoteNotPopulated(string? schoolCode, string? subjectCode, string? noteTitle)
    {
        return $"ERROR: SchoolCode: {schoolCode}, SubjectCode: {subjectCode}, or NoteTitle: {noteTitle} are null";
    }
}
