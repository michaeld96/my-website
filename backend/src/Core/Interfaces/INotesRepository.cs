using System;
using Core.Models;

namespace Core.Interfaces;

public interface INotesRepository
{
    public Task<User?> GetUserOrNullAsync(string username, CancellationToken ct);
}
