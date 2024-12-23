using System;
using Core.Models;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class NotesContext : DbContext
{
    public DbSet<Note> Notes { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;

    public NotesContext(DbContextOptions<NotesContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed data for Notes
        modelBuilder.Entity<Note>().HasData(
            new Note
            {
                NotePK = 1,
                School = "UM",
                Subject = "EECS 281: Data Structures and Algorithms",
                Title = "Overview",
                Content = "# Data Structures and Algorithms\n\nThis is a test for the overview of EECS 281.",
                Tags = "data-structures, algorithms"
            },
            new Note
            {
                NotePK = 2,
                School = "GT",
                Subject = "CS 6200: Intro to Operating Systems",
                Title = "Overview",
                Content = "# Intro to Operating Systems\n\nThis is a test for the overview of CS 6200.",
                Tags = "operating-systems"
            }
        );

        // Seed data for Users
        modelBuilder.Entity<User>().HasData(
            new User
            {
                UserPK = 1,
                Username = "admin",
                PasswordHash = "password123"
            }
        );
    }
}