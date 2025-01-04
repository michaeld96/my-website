using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedingEECS281Lectures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 4,
                columns: new[] { "Content", "School", "Subject", "Tags", "Title" },
                values: new object[] { "# Lecture 1: Stack, Queue, and Priority Queue ADTs\n\nTest test test...", "UM", "EECS 281: Data Structures and Algorithms", "data-structures, algorithms", "Lecture 1: Stack, Queue, and Priority Queue ADTs" });

            migrationBuilder.UpdateData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 5,
                columns: new[] { "Content", "School", "Subject", "Tags", "Title" },
                values: new object[] { "# Lecture 2: Complexity Analysis, Math Foundations\n\nTest test test...", "UM", "EECS 281: Data Structures and Algorithms", "data-structures, algorithms", "Lecture 2: Complexity Analysis, Math Foundations" });

            migrationBuilder.UpdateData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 6,
                columns: new[] { "Content", "School", "Subject", "Tags", "Title" },
                values: new object[] { "# Lecture 3: Measuring Performance and Analysis Tools\n\nTest test test...", "UM", "EECS 281: Data Structures and Algorithms", "data-structures, algorithms", "Lecture 3: Measuring Performance and Analysis Tools" });

            migrationBuilder.InsertData(
                table: "Notes",
                columns: new[] { "NotePK", "Content", "School", "Subject", "Tags", "Title" },
                values: new object[,]
                {
                    { 7, "# Intro to Operating Systems\n\nThis is a test for the overview of CS 6200.", "GT", "CS 6200: Intro to Operating Systems", "operating-systems", "Overview" },
                    { 8, "# Advanced Operating Systems\n\nThis is a test for the overview of CS 6210.", "GT", "CS 6210: Advanced Operating Systems", "operating-systems", "Overview" },
                    { 9, "# Distributed Computing\n\nThis is a test for the overview of CS 7210.", "GT", "CS 7210: Distributed Computing", "distributed-systems", "Overview" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 9);

            migrationBuilder.UpdateData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 4,
                columns: new[] { "Content", "School", "Subject", "Tags", "Title" },
                values: new object[] { "# Intro to Operating Systems\n\nThis is a test for the overview of CS 6200.", "GT", "CS 6200: Intro to Operating Systems", "operating-systems", "Overview" });

            migrationBuilder.UpdateData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 5,
                columns: new[] { "Content", "School", "Subject", "Tags", "Title" },
                values: new object[] { "# Advanced Operating Systems\n\nThis is a test for the overview of CS 6210.", "GT", "CS 6210: Advanced Operating Systems", "operating-systems", "Overview" });

            migrationBuilder.UpdateData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 6,
                columns: new[] { "Content", "School", "Subject", "Tags", "Title" },
                values: new object[] { "# Distributed Computing\n\nThis is a test for the overview of CS 7210.", "GT", "CS 7210: Distributed Computing", "distributed-systems", "Overview" });
        }
    }
}
