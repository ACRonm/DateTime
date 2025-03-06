using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TimezoneConverter.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddShareableIdToEvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ShareableId",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShareableId",
                table: "Events");
        }
    }
}
