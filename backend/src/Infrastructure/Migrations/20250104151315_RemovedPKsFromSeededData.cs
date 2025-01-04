using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemovedPKsFromSeededData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 6);

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

            migrationBuilder.InsertData(
                table: "Notes",
                columns: new[] { "NotePK", "Content", "School", "Subject", "Tags", "Title" },
                values: new object[,]
                {
                    { -9, "# Distributed Computing\n\nThis is a test for the overview of CS 7210.", "GT", "CS 7210: Distributed Computing", "distributed-systems", "Overview" },
                    { -8, "# Advanced Operating Systems\n\nThis is a test for the overview of CS 6210.", "GT", "CS 6210: Advanced Operating Systems", "operating-systems", "Overview" },
                    { -7, "# Intro to Operating Systems\n\nThis is a test for the overview of CS 6200.", "GT", "CS 6200: Intro to Operating Systems", "operating-systems", "Overview" },
                    { -6, "# Lecture 3: Measuring Performance and Analysis Tools\n\nTest test test...", "UM", "EECS 281: Data Structures and Algorithms", "data-structures, algorithms", "Lecture 3: Measuring Performance and Analysis Tools" },
                    { -5, "# Lecture 2: Complexity Analysis, Math Foundations\n\nTest test test...", "UM", "EECS 281: Data Structures and Algorithms", "data-structures, algorithms", "Lecture 2: Complexity Analysis, Math Foundations" },
                    { -4, "# Lecture 1: Stack, Queue, and Priority Queue ADTs\n\nTest test test...", "UM", "EECS 281: Data Structures and Algorithms", "data-structures, algorithms", "Lecture 1: Stack, Queue, and Priority Queue ADTs" },
                    { -3, "# Data Structures and Algorithms\n\nThis is a test for the overview of EECS 281.", "UM", "EECS 281: Data Structures and Algorithms", "data-structures, algorithms", "Overview" },
                    { -2, "# Programming and Intro Data Structures\n\nThis is a test for the overview of EECS 280.", "UM", "EECS 280: Programming and Intro Data Structures", "data-structures", "Overview" },
                    { -1, "# Elementary Programming Concepts\n\nThis is a test for the overview of EECS 183.", "UM", "EECS 183: Elementary Programming Concepts", "", "Overview" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: -9);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: -8);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: -7);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: -6);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: -5);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: -4);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: -3);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: -2);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: -1);

            migrationBuilder.InsertData(
                table: "Notes",
                columns: new[] { "NotePK", "Content", "School", "Subject", "Tags", "Title" },
                values: new object[,]
                {
                    { 1, "# Elementary Programming Concepts\n\nThis is a test for the overview of EECS 183.", "UM", "EECS 183: Elementary Programming Concepts", "", "Overview" },
                    { 2, "# Programming and Intro Data Structures\n\nThis is a test for the overview of EECS 280.", "UM", "EECS 280: Programming and Intro Data Structures", "data-structures", "Overview" },
                    { 3, "# Data Structures and Algorithms\n\nThis is a test for the overview of EECS 281.", "UM", "EECS 281: Data Structures and Algorithms", "data-structures, algorithms", "Overview" },
                    { 4, "# Lecture 1: Stack, Queue, and Priority Queue ADTs\n\nTest test test...", "UM", "EECS 281: Data Structures and Algorithms", "data-structures, algorithms", "Lecture 1: Stack, Queue, and Priority Queue ADTs" },
                    { 5, "# Lecture 2: Complexity Analysis, Math Foundations\n\nTest test test...", "UM", "EECS 281: Data Structures and Algorithms", "data-structures, algorithms", "Lecture 2: Complexity Analysis, Math Foundations" },
                    { 6, "# Lecture 3: Measuring Performance and Analysis Tools\n\nTest test test...", "UM", "EECS 281: Data Structures and Algorithms", "data-structures, algorithms", "Lecture 3: Measuring Performance and Analysis Tools" },
                    { 7, "# Intro to Operating Systems\n\nThis is a test for the overview of CS 6200.", "GT", "CS 6200: Intro to Operating Systems", "operating-systems", "Overview" },
                    { 8, "# Advanced Operating Systems\n\nThis is a test for the overview of CS 6210.", "GT", "CS 6210: Advanced Operating Systems", "operating-systems", "Overview" },
                    { 9, "# Distributed Computing\n\nThis is a test for the overview of CS 7210.", "GT", "CS 7210: Distributed Computing", "distributed-systems", "Overview" }
                });
        }
    }
}
