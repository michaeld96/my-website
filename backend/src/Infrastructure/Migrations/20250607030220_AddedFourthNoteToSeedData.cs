using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedFourthNoteToSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Notes",
                keyColumn: "Id",
                keyValue: 1,
                column: "Title",
                value: "Lecture 1: Stack, Queue, and Priority Queue ADTs");

            migrationBuilder.InsertData(
                table: "Notes",
                columns: new[] { "Id", "CreatedAt", "Markdown", "SubjectId", "Title", "UpdatedAt" },
                values: new object[] { 4, new DateTime(2025, 6, 3, 0, 0, 0, 0, DateTimeKind.Utc), "Here is link to the lecture: https://www.youtube.com/watch?v=rO_ThtXqykc&list=PLmotwOE2mfH6-4Mw9GUbgpLKx2waxPhKJ&index=3", 1, "Lecture 2: Complexity Analysis, Math Foundations", new DateTime(2025, 6, 3, 0, 0, 0, 0, DateTimeKind.Utc) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.UpdateData(
                table: "Notes",
                keyColumn: "Id",
                keyValue: 1,
                column: "Title",
                value: "Lecture 1: Introduction");
        }
    }
}
