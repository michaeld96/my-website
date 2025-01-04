using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedSeededGTSubjects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Notes",
                columns: new[] { "NotePK", "Content", "School", "Subject", "Tags", "Title" },
                values: new object[,]
                {
                    { 5, "# Advanced Operating Systems\n\nThis is a test for the overview of CS 6210.", "GT", "CS 6210: Advanced Operating Systems", "operating-systems", "Overview" },
                    { 6, "# Distributed Computing\n\nThis is a test for the overview of CS 7210.", "GT", "CS 7210: Distributed Computing", "distributed-systems", "Overview" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "NotePK",
                keyValue: 6);
        }
    }
}
