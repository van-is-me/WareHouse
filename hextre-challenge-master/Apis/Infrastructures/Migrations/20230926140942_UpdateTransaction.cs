using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructures.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTransaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DepositPayments_AspNetUsers_CustomerId",
                table: "DepositPayments");

            migrationBuilder.DropIndex(
                name: "IX_DepositPayments_CustomerId",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                table: "DepositPayments");

            migrationBuilder.AddColumn<double>(
                name: "Amount",
                table: "DepositPayments",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "IpnURL",
                table: "DepositPayments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OrderInfo",
                table: "DepositPayments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PartnerCode",
                table: "DepositPayments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethod",
                table: "DepositPayments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RedirectUrl",
                table: "DepositPayments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RequestId",
                table: "DepositPayments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RequestType",
                table: "DepositPayments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "DepositPayments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "extraData",
                table: "DepositPayments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "message",
                table: "DepositPayments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "orderIdFormMomo",
                table: "DepositPayments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "orderType",
                table: "DepositPayments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "payType",
                table: "DepositPayments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "responseTime",
                table: "DepositPayments",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "resultCode",
                table: "DepositPayments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "signature",
                table: "DepositPayments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<long>(
                name: "transId",
                table: "DepositPayments",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amount",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "IpnURL",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "OrderInfo",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "PartnerCode",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "RedirectUrl",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "RequestId",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "RequestType",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "extraData",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "message",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "orderIdFormMomo",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "orderType",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "payType",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "responseTime",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "resultCode",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "signature",
                table: "DepositPayments");

            migrationBuilder.DropColumn(
                name: "transId",
                table: "DepositPayments");

            migrationBuilder.AddColumn<string>(
                name: "CustomerId",
                table: "DepositPayments",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DepositPayments_CustomerId",
                table: "DepositPayments",
                column: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_DepositPayments_AspNetUsers_CustomerId",
                table: "DepositPayments",
                column: "CustomerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
