using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Class",
                table: "Notes",
                newName: "Subject");

            migrationBuilder.InsertData(
                table: "Notes",
                columns: new[] { "NotePK", "Content", "School", "Subject", "Tags", "Title" },
                values: new object[,]
                {
                    { 1, "# Data Structures and Algorithms\n\nThis is a test for the overview of EECS 281.", "UM", "EECS 281: Data Structures and Algorithms", "data-structures, algorithms", "Overview" },
                    { 2, "# Intro to Operating Systems\n\nThis is a test for the overview of CS 6200.", "GT", "CS 6200: Intro to Operating Systems", "operating-systems", "Overview" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 2);

            migrationBuilder.RenameColumn(
                name: "Subject",
                table: "Notes",
                newName: "Class");
        }
    }
}
