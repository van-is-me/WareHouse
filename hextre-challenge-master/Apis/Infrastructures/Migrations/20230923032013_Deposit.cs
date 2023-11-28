using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructures.Migrations
{
    /// <inheritdoc />
    public partial class Deposit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CustomerId",
                table: "DepositPayments",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrderId",
                table: "DepositPayments",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_DepositPayments_CustomerId",
                table: "DepositPayments",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_DepositPayments_OrderId",
                table: "DepositPayments",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_DepositPayments_AspNetUsers_CustomerId",
                table: "DepositPayments",
                column: "CustomerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DepositPayments_Order_OrderId",
                table: "DepositPayments",
                column: "OrderId",
                principalTable: "Order",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DepositPayments_AspNetUsers_CustomerId",
                table: "DepositPayments");

            migrationBuilder.DropForeignKey(
                name: "FK_DepositPayments_Order_OrderId",
                table: "DepositPayments");

            migrationBuilder.DropIndex(
                name: "IX_DepositPayments_CustomerId",
                table: "DepositPayments");

            migrationBuilder.DropIndex(
                name: "IX_DepositPayments_OrderId",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "OrderId",
                table: "DepositPayments");
        }
    }
}
