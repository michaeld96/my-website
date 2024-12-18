using System;
using Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class NotesContext : DbContext
{
    public NotesContext(DbContextOptions<NotesContext> options) : base(options)
    {

    }

    // null!, where ! is known as the null forgiving operator.
    // This is saying that this will not be null at runtime.
    public DbSet<Note> Notes { get; set; } = null!;
}