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
                Subject = "EECS 183: Elementary Programming Concepts",
                Title = "Overview",
                Content = "# Elementary Programming Concepts\n\nThis is a test for the overview of EECS 183.",
                Tags = ""
            },
            new Note
            {
                NotePK = 2,
                School = "UM",
                Subject = "EECS 280: Programming and Intro Data Structures",
                Title = "Overview",
                Content = "# Programming and Intro Data Structures\n\nThis is a test for the overview of EECS 280.",
                Tags = "data-structures"
            },
            new Note
            {
                NotePK = 3,
                School = "UM",
                Subject = "EECS 281: Data Structures and Algorithms",
                Title = "Overview",
                Content = "# Data Structures and Algorithms\n\nThis is a test for the overview of EECS 281.",
                Tags = "data-structures, algorithms"
            },
            new Note
            {
                NotePK = 4,
                School = "GT",
                Subject = "CS 6200: Intro to Operating Systems",
                Title = "Overview",
                Content = "# Intro to Operating Systems\n\nThis is a test for the overview of CS 6200.",
                Tags = "operating-systems"
            },
            new Note
            {
                NotePK = 5,
                School = "GT",
                Subject = "CS 6210: Advanced Operating Systems",
                Title = "Overview",
                Content = "# Advanced Operating Systems\n\nThis is a test for the overview of CS 6210.",
                Tags = "operating-systems"
            },
            new Note
            {
                NotePK = 6,
                School = "GT",
                Subject = "CS 7210: Distributed Computing",
                Title = "Overview",
                Content = "# Distributed Computing\n\nThis is a test for the overview of CS 7210.",
                Tags = "distributed-systems"
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