using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WatchStore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWatchSpecificationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BandMaterial",
                table: "Watches",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BandWidth",
                table: "Watches",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CaseMaterial",
                table: "Watches",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Crystal",
                table: "Watches",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Functions",
                table: "Watches",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Thickness",
                table: "Watches",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Warranty",
                table: "Watches",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BandMaterial",
                table: "Watches");

            migrationBuilder.DropColumn(
                name: "BandWidth",
                table: "Watches");

            migrationBuilder.DropColumn(
                name: "CaseMaterial",
                table: "Watches");

            migrationBuilder.DropColumn(
                name: "Crystal",
                table: "Watches");

            migrationBuilder.DropColumn(
                name: "Functions",
                table: "Watches");

            migrationBuilder.DropColumn(
                name: "Thickness",
                table: "Watches");

            migrationBuilder.DropColumn(
                name: "Warranty",
                table: "Watches");
        }
    }
}
