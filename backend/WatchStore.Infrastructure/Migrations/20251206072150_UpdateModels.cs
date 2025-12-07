using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WatchStore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Watches_BrandId_Status",
                table: "Watches");

            migrationBuilder.DropIndex(
                name: "IX_Watches_Name",
                table: "Watches");

            migrationBuilder.DropIndex(
                name: "IX_Watches_Price",
                table: "Watches");

            migrationBuilder.DropIndex(
                name: "IX_Watches_Status",
                table: "Watches");

            migrationBuilder.DropIndex(
                name: "IX_Orders_CreatedAt",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_Status",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Brands_Name",
                table: "Brands");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Watches_BrandId_Status",
                table: "Watches",
                columns: new[] { "BrandId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_Watches_Name",
                table: "Watches",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Watches_Price",
                table: "Watches",
                column: "Price");

            migrationBuilder.CreateIndex(
                name: "IX_Watches_Status",
                table: "Watches",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CreatedAt",
                table: "Orders",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_Status",
                table: "Orders",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Brands_Name",
                table: "Brands",
                column: "Name");
        }
    }
}
