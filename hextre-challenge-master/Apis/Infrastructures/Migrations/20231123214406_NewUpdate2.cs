using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructures.Migrations
{
    /// <inheritdoc />
    public partial class NewUpdate2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_ServicePayment_PaymentId",
                table: "Transactions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Transactions",
                table: "Transactions");

            migrationBuilder.RenameTable(
                name: "Transactions",
                newName: "Transaction");

            migrationBuilder.RenameIndex(
                name: "IX_Transactions_PaymentId",
                table: "Transaction",
                newName: "IX_Transaction_PaymentId");

            migrationBuilder.AddColumn<double>(
                name: "Amount",
                table: "Transaction",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "Info",
                table: "Transaction",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "IpnURL",
                table: "Transaction",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PartnerCode",
                table: "Transaction",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethod",
                table: "Transaction",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RedirectUrl",
                table: "Transaction",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RequestId",
                table: "Transaction",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RequestType",
                table: "Transaction",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Transaction",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "extraData",
                table: "Transaction",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "message",
                table: "Transaction",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "orderIdFormMomo",
                table: "Transaction",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "orderType",
                table: "Transaction",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "payType",
                table: "Transaction",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "responseTime",
                table: "Transaction",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "resultCode",
                table: "Transaction",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "signature",
                table: "Transaction",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<long>(
                name: "transId",
                table: "Transaction",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Transaction",
                table: "Transaction",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Transaction_ServicePayment_PaymentId",
                table: "Transaction",
                column: "PaymentId",
                principalTable: "ServicePayment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transaction_ServicePayment_PaymentId",
                table: "Transaction");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Transaction",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "Amount",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "Info",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "IpnURL",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "PartnerCode",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "RedirectUrl",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "RequestId",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "RequestType",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "extraData",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "message",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "orderIdFormMomo",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "orderType",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "payType",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "responseTime",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "resultCode",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "signature",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "transId",
                table: "Transaction");

            migrationBuilder.RenameTable(
                name: "Transaction",
                newName: "Transactions");

            migrationBuilder.RenameIndex(
                name: "IX_Transaction_PaymentId",
                table: "Transactions",
                newName: "IX_Transactions_PaymentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Transactions",
                table: "Transactions",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_ServicePayment_PaymentId",
                table: "Transactions",
                column: "PaymentId",
                principalTable: "ServicePayment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
