using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MadeSelectorColumnInPRR : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PasswordResetRequests_TokenHash",
                table: "PasswordResetRequests");

            migrationBuilder.AlterColumn<string>(
                name: "TokenHash",
                table: "PasswordResetRequests",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "Selector",
                table: "PasswordResetRequests",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetRequests_Selector",
                table: "PasswordResetRequests",
                column: "Selector",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PasswordResetRequests_Selector",
                table: "PasswordResetRequests");

            migrationBuilder.DropColumn(
                name: "Selector",
                table: "PasswordResetRequests");

            migrationBuilder.AlterColumn<string>(
                name: "TokenHash",
                table: "PasswordResetRequests",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(128)",
                oldMaxLength: 128);

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetRequests_TokenHash",
                table: "PasswordResetRequests",
                column: "TokenHash",
                unique: true);
        }
    }
}
