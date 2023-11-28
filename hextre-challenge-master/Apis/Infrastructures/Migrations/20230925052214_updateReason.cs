using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructures.Migrations
{
    /// <inheritdoc />
    public partial class updateReason : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CancelReasonId",
                table: "Order");

            migrationBuilder.AddColumn<string>(
                name: "CancelReason",
                table: "Order",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CancelReason",
                table: "Order");

            migrationBuilder.AddColumn<Guid>(
                name: "CancelReasonId",
                table: "Order",
                type: "uniqueidentifier",
                nullable: true);
        }
    }
}
