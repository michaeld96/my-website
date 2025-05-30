using System;
using Core.Models;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class NotesContext : DbContext
{
    public DbSet<School> Schools { get; set; } = null!;
    public DbSet<Subject> Subjects { get; set; } = null!;
    public DbSet<Note> Notes { get; set; } = null!;
    public DbSet<Tag> Tags { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;

    public NotesContext(DbContextOptions<NotesContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}