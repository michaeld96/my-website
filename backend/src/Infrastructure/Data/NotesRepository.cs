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
    public NotesRepository(NotesContext context)
    {
        _context = context;
    }
}