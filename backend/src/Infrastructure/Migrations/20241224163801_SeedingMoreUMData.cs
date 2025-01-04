using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedingMoreUMData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 1,
                columns: new[] { "Content", "Subject", "Tags" },
                values: new object[] { "# Elementary Programming Concepts\n\nThis is a test for the overview of EECS 183.", "EECS 183: Elementary Programming Concepts", "" });

            migrationBuilder.UpdateData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 2,
                columns: new[] { "Content", "School", "Subject", "Tags" },
                values: new object[] { "# Programming and Intro Data Structures\n\nThis is a test for the overview of EECS 280.", "UM", "EECS 280: Programming and Intro Data Structures", "data-structures" });

            migrationBuilder.InsertData(
                table: "Notes",
                columns: new[] { "NotePK", "Content", "School", "Subject", "Tags", "Title" },
                values: new object[,]
                {
                    { 3, "# Data Structures and Algorithms\n\nThis is a test for the overview of EECS 281.", "UM", "EECS 281: Data Structures and Algorithms", "data-structures, algorithms", "Overview" },
                    { 4, "# Intro to Operating Systems\n\nThis is a test for the overview of CS 6200.", "GT", "CS 6200: Intro to Operating Systems", "operating-systems", "Overview" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 4);

            migrationBuilder.UpdateData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 1,
                columns: new[] { "Content", "Subject", "Tags" },
                values: new object[] { "# Data Structures and Algorithms\n\nThis is a test for the overview of EECS 281.", "EECS 281: Data Structures and Algorithms", "data-structures, algorithms" });

            migrationBuilder.UpdateData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 2,
                columns: new[] { "Content", "School", "Subject", "Tags" },
                values: new object[] { "# Intro to Operating Systems\n\nThis is a test for the overview of CS 6200.", "GT", "CS 6200: Intro to Operating Systems", "operating-systems" });
        }
    }
}
