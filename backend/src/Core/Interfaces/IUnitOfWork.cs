using System;

namespace Core.Interfaces;

public interface IUnitOfWork : IDisposable, IAsyncDisposable
{
    INotesRepository NotesRepo { get; }
    Task<int> CommitAsync(CancellationToken ct = default);
}
