using System;
using Core.Models;

namespace Core.Interfaces;

public interface INotesRepository
{
    Task<Note?> GetNoteAsync(string school, string subject, string title);
}
