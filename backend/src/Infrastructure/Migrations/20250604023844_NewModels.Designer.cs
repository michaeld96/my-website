﻿// <auto-generated />
using System;
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
    [Migration("20250604023844_NewModels")]
    partial class NewModels
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
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Markdown")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("SubjectId")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("SubjectId");

                    b.ToTable("Notes");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            CreatedAt = new DateTime(2025, 6, 3, 0, 0, 0, 0, DateTimeKind.Utc),
                            Markdown = "This is an introduction to EECS 281!",
                            SubjectId = 1,
                            Title = "Lecture 1: Introduction",
                            UpdatedAt = new DateTime(2025, 6, 3, 0, 0, 0, 0, DateTimeKind.Utc)
                        },
                        new
                        {
                            Id = 2,
                            CreatedAt = new DateTime(2025, 6, 3, 0, 0, 0, 0, DateTimeKind.Utc),
                            Markdown = "We all have an intuitive understanding of what a program is: \r\nit's some thing that instructs a computer to do something. \r\nBut the language in which we tend to write our programs is nothing like the language that the computer understands natively. \r\nSomething must translate the source code of our programs into a form the computer understands.\\n\r\nHere is some more info",
                            SubjectId = 2,
                            Title = "Introduction to compilers, course overview",
                            UpdatedAt = new DateTime(2025, 6, 3, 0, 0, 0, 0, DateTimeKind.Utc)
                        },
                        new
                        {
                            Id = 3,
                            CreatedAt = new DateTime(2025, 6, 3, 0, 0, 0, 0, DateTimeKind.Utc),
                            Markdown = "Databases....",
                            SubjectId = 3,
                            Title = "Lecture 1: Introduction",
                            UpdatedAt = new DateTime(2025, 6, 3, 0, 0, 0, 0, DateTimeKind.Utc)
                        });
                });

            modelBuilder.Entity("Core.Models.School", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Schools");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Code = "UM",
                            Name = "University of Michigan"
                        },
                        new
                        {
                            Id = 2,
                            Code = "GT",
                            Name = "Georgia Tech"
                        });
                });

            modelBuilder.Entity("Core.Models.Subject", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("SchoolId")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("SchoolId");

                    b.ToTable("Subjects");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            SchoolId = 1,
                            Title = "EECS 281: Data Structures and Algorithms"
                        },
                        new
                        {
                            Id = 2,
                            SchoolId = 1,
                            Title = "EECS 483: Compiler Construction"
                        },
                        new
                        {
                            Id = 3,
                            SchoolId = 2,
                            Title = "CS 6400: Database Systems Concepts and Design"
                        });
                });

            modelBuilder.Entity("Core.Models.Tag", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Tags");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Name = "data-structures"
                        },
                        new
                        {
                            Id = 2,
                            Name = "algorithms"
                        },
                        new
                        {
                            Id = 3,
                            Name = "compilers"
                        },
                        new
                        {
                            Id = 4,
                            Name = "databases"
                        });
                });

            modelBuilder.Entity("Core.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("NoteTag", b =>
                {
                    b.Property<int>("NotesId")
                        .HasColumnType("int");

                    b.Property<int>("TagsId")
                        .HasColumnType("int");

                    b.HasKey("NotesId", "TagsId");

                    b.HasIndex("TagsId");

                    b.ToTable("NoteTag");
                });

            modelBuilder.Entity("Core.Models.Note", b =>
                {
                    b.HasOne("Core.Models.Subject", "Subject")
                        .WithMany("Notes")
                        .HasForeignKey("SubjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Subject");
                });

            modelBuilder.Entity("Core.Models.Subject", b =>
                {
                    b.HasOne("Core.Models.School", "School")
                        .WithMany("Subjects")
                        .HasForeignKey("SchoolId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("School");
                });

            modelBuilder.Entity("NoteTag", b =>
                {
                    b.HasOne("Core.Models.Note", null)
                        .WithMany()
                        .HasForeignKey("NotesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Core.Models.Tag", null)
                        .WithMany()
                        .HasForeignKey("TagsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Core.Models.School", b =>
                {
                    b.Navigation("Subjects");
                });

            modelBuilder.Entity("Core.Models.Subject", b =>
                {
                    b.Navigation("Notes");
                });
#pragma warning restore 612, 618
        }
    }
}
