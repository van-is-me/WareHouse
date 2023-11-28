using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructures.Migrations
{
    /// <inheritdoc />
    public partial class updateWarehousePrice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Price",
                table: "WarehouseDetail",
                newName: "WarehousePrice");

            migrationBuilder.AddColumn<double>(
                name: "ServicePrice",
                table: "WarehouseDetail",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ServicePrice",
                table: "WarehouseDetail");

            migrationBuilder.RenameColumn(
                name: "WarehousePrice",
                table: "WarehouseDetail",
                newName: "Price");
        }
    }
}
