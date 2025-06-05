using System;
using Core.Interfaces;

namespace Infrastructure.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly NotesContext _context;
    // Exposing the repo so we can get access to all the functions.
    public INotesRepository NotesRepo { get; }
    public UnitOfWork(NotesContext context, INotesRepository notesRepo)
    {
        NotesRepo = notesRepo;
        _context = context;
    }
    // Cool syntax shortcut for the body of the function.
    public Task<int> CommitAsync(CancellationToken ct = default) => _context.SaveChangesAsync(ct);

    public ValueTask DisposeAsync() => _context.DisposeAsync();

    public void Dispose() => _context.Dispose();
    
}