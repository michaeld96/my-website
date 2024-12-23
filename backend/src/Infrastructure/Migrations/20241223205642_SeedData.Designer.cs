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
    [Migration("20241223205642_SeedData")]
    partial class SeedData
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
                            Content = "# Data Structures and Algorithms\n\nThis is a test for the overview of EECS 281.",
                            School = "UM",
                            Subject = "EECS 281: Data Structures and Algorithms",
                            Tags = "data-structures, algorithms",
                            Title = "Overview"
                        },
                        new
                        {
                            NotePK = 2,
                            Content = "# Intro to Operating Systems\n\nThis is a test for the overview of CS 6200.",
                            School = "GT",
                            Subject = "CS 6200: Intro to Operating Systems",
                            Tags = "operating-systems",
                            Title = "Overview"
                        });
                });
#pragma warning restore 612, 618
        }
    }
}