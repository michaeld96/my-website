﻿// <auto-generated />
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Infrastructure.Migrations
{
    [DbContext(typeof(NotesContext))]
    [Migration("20241224170139_SeedingEECS281Lectures")]
    partial class SeedingEECS281Lectures
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Core.Models.Note", b =>
                {
                    b.Property<int>("NotePK")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("NotePK"));

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("School")
                        .IsRequired()
                        .HasMaxLength(2)
                        .HasColumnType("nvarchar(2)");

                    b.Property<string>("Subject")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Tags")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("NotePK");

                    b.ToTable("Notes");

                    b.HasData(
                        new
                        {
                            NotePK = 1,
                            Content = "# Elementary Programming Concepts\n\nThis is a test for the overview of EECS 183.",
                            School = "UM",
                            Subject = "EECS 183: Elementary Programming Concepts",
                            Tags = "",
                            Title = "Overview"
                        },
                        new
                        {
                            NotePK = 2,
                            Content = "# Programming and Intro Data Structures\n\nThis is a test for the overview of EECS 280.",
                            School = "UM",
                            Subject = "EECS 280: Programming and Intro Data Structures",
                            Tags = "data-structures",
                            Title = "Overview"
                        },
                        new
                        {
                            NotePK = 3,
                            Content = "# Data Structures and Algorithms\n\nThis is a test for the overview of EECS 281.",
                            School = "UM",
                            Subject = "EECS 281: Data Structures and Algorithms",
                            Tags = "data-structures, algorithms",
                            Title = "Overview"
                        },
                        new
                        {
                            NotePK = 4,
                            Content = "# Lecture 1: Stack, Queue, and Priority Queue ADTs\n\nTest test test...",
                            School = "UM",
                            Subject = "EECS 281: Data Structures and Algorithms",
                            Tags = "data-structures, algorithms",
                            Title = "Lecture 1: Stack, Queue, and Priority Queue ADTs"
                        },
                        new
                        {
                            NotePK = 5,
                            Content = "# Lecture 2: Complexity Analysis, Math Foundations\n\nTest test test...",
                            School = "UM",
                            Subject = "EECS 281: Data Structures and Algorithms",
                            Tags = "data-structures, algorithms",
                            Title = "Lecture 2: Complexity Analysis, Math Foundations"
                        },
                        new
                        {
                            NotePK = 6,
                            Content = "# Lecture 3: Measuring Performance and Analysis Tools\n\nTest test test...",
                            School = "UM",
                            Subject = "EECS 281: Data Structures and Algorithms",
                            Tags = "data-structures, algorithms",
                            Title = "Lecture 3: Measuring Performance and Analysis Tools"
                        },
                        new
                        {
                            NotePK = 7,
                            Content = "# Intro to Operating Systems\n\nThis is a test for the overview of CS 6200.",
                            School = "GT",
                            Subject = "CS 6200: Intro to Operating Systems",
                            Tags = "operating-systems",
                            Title = "Overview"
                        },
                        new
                        {
                            NotePK = 8,
                            Content = "# Advanced Operating Systems\n\nThis is a test for the overview of CS 6210.",
                            School = "GT",
                            Subject = "CS 6210: Advanced Operating Systems",
                            Tags = "operating-systems",
                            Title = "Overview"
                        },
                        new
                        {
                            NotePK = 9,
                            Content = "# Distributed Computing\n\nThis is a test for the overview of CS 7210.",
                            School = "GT",
                            Subject = "CS 7210: Distributed Computing",
                            Tags = "distributed-systems",
                            Title = "Overview"
                        });
                });

            modelBuilder.Entity("Core.Models.User", b =>
                {
                    b.Property<int>("UserPK")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserPK"));

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("UserPK");

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            UserPK = 1,
                            PasswordHash = "password123",
                            Username = "admin"
                        });
                });
#pragma warning restore 612, 618
        }
    }
}
