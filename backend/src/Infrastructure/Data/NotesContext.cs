using System;
using Core.Models;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class NotesContext : DbContext
{
    // Each DbSet<T> represents a table in the DB.
    public DbSet<School> Schools { get; set; } = null!;
    public DbSet<Subject> Subjects { get; set; } = null!;
    public DbSet<Note> Notes { get; set; } = null!;
    public DbSet<Tag> Tags { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<PasswordResetRequest> PasswordResetRequests { get; set; } = null!;

    public NotesContext(DbContextOptions<NotesContext> options) : base(options)
    {

    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder b)
    {
        base.OnModelCreating(b);

        // Creating a many-to-many join table where the PK is (NoteId, TagId).
        b.Entity<Note>()
            .HasMany(n => n.Tags)
            .WithMany(t => t.Notes)
            .UsingEntity("NoteTag");
        
        // Defining the relationship for user to password reset request.
        b.Entity<PasswordResetRequest>()
            .HasOne(r => r.User)
            .WithMany(u => u.PasswordResetRequests)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Fast lookup by token and ensures no dupes.
        b.Entity<PasswordResetRequest>()
            .HasIndex(r => r.Selector)
            .IsUnique();
            
        // query support.
        b.Entity<PasswordResetRequest>()
            .HasIndex(r => r.UserId);

        b.Entity<School>().HasData(
            new School { Id = 1, Code = "UM", Name = "University of Michigan" },
            new School { Id = 2, Code = "GT", Name = "Georgia Tech" }
        );

        b.Entity<Subject>().HasData(
            new Subject { Id = 1, Code = "EECS 281", Title = "Data Structures and Algorithms", SchoolId = 1 },
            new Subject { Id = 2, Code = "EECS 483", Title = "Compiler Construction", SchoolId = 1 },
            new Subject { Id = 3, Code = "CS 6400", Title = "Database Systems Concepts and Design", SchoolId = 2 }
        );

        b.Entity<Tag>().HasData(
            new Tag { Id = 1, Name = "data-structures" },
            new Tag { Id = 2, Name = "algorithms" },
            new Tag { Id = 3, Name = "compilers" },
            new Tag { Id = 4, Name = "databases" }
        );
        
        // Populate the many-to-many table.
        b.Entity("NoteTag").HasData(
            new { NotesId = 1, TagsId = 1 },
            new { NotesId = 1, TagsId = 2 }
        );

        // Adding this to see if this solves EF problem.
        // EF will throw an error if computed values are in the seed data
        // because whatever is written in the migration is what is expected
        // when applying the migration.
        var seeded_time = new DateTime(2025, 06, 03, 0, 0, 0, DateTimeKind.Utc);

        b.Entity<Note>().HasData(
            new Note
            {
                Id = 1,
                CreatedAt = seeded_time,
                UpdatedAt = seeded_time,
                Title = "Lecture 1: Stack, Queue, and Priority Queue ADTs",
                Markdown = "This is an introduction to EECS 281!",
                SubjectId = 1
            },
            new Note
            {
                Id = 2,
                CreatedAt = seeded_time,
                UpdatedAt = seeded_time,
                Title = "Introduction to compilers, course overview",
                Markdown = """
                We all have an intuitive understanding of what a program is: 
                it's some thing that instructs a computer to do something. 
                But the language in which we tend to write our programs is nothing like the language that the computer understands natively. 
                Something must translate the source code of our programs into a form the computer understands.\n
                Here is some more info
                """,
                SubjectId = 2
            },
            new Note
            {
                Id = 3,
                CreatedAt = seeded_time,
                UpdatedAt = seeded_time,
                Title = "Lecture 1: Introduction",
                Markdown = "Databases....",
                SubjectId = 3
            },
            new Note
            {
                Id = 4,
                CreatedAt = seeded_time,
                UpdatedAt = seeded_time,
                Title = "Lecture 2: Complexity Analysis, Math Foundations",
                Markdown = "Here is link to the lecture: https://www.youtube.com/watch?v=rO_ThtXqykc&list=PLmotwOE2mfH6-4Mw9GUbgpLKx2waxPhKJ&index=3",
                SubjectId = 1
            }
        );

        b.Entity<User>().HasData(
            new User { Id = 1, Username = "mike", PasswordHash = "$2a$12$58lIBD9ybdFElYutT9Bp9.MHDgInFH5BRpofb6XMOm31uqx5mKnMe" }
        );
    }
}