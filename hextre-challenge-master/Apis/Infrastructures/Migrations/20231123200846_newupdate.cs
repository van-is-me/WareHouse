using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructures.Migrations
{
    /// <inheritdoc />
    public partial class newupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExtensionPeriod",
                table: "ServicePayment");

            migrationBuilder.RenameColumn(
                name: "Price",
                table: "ServicePayment",
                newName: "WarehousePrice");

            migrationBuilder.AddColumn<double>(
                name: "ServicePrice",
                table: "ServicePayment",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "TotalPrice",
                table: "ServicePayment",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ServicePrice",
                table: "ServicePayment");

            migrationBuilder.DropColumn(
                name: "TotalPrice",
                table: "ServicePayment");

            migrationBuilder.RenameColumn(
                name: "WarehousePrice",
                table: "ServicePayment",
                newName: "Price");

            migrationBuilder.AddColumn<DateTime>(
                name: "ExtensionPeriod",
                table: "ServicePayment",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
