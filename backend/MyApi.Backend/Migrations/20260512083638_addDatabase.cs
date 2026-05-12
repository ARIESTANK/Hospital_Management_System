using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApi.Backend.Migrations
{
    /// <inheritdoc />
    public partial class addDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MEDICINES",
                columns: table => new
                {
                    MEDICINE_ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    MEDICINE_CODE = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    MEDICINE_NAME = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    STOCK = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    PRICE = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MEDICINES", x => x.MEDICINE_ID);
                });

            migrationBuilder.CreateTable(
                name: "PATIENTS",
                columns: table => new
                {
                    PATIENT_ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    PATIENT_NAME = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    CASE = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    HEALTHSTATUS = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    ARRIVAL_DATE = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PATIENTS", x => x.PATIENT_ID);
                });

            migrationBuilder.CreateTable(
                name: "ROOMS",
                columns: table => new
                {
                    ROOM_ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    ROOM_NUMBER = table.Column<string>(type: "NVARCHAR2(10)", maxLength: 10, nullable: false),
                    ROOM_TYPE = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    STATUS = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    DAILY_RATE = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ROOMS", x => x.ROOM_ID);
                });

            migrationBuilder.CreateTable(
                name: "USERS",
                columns: table => new
                {
                    USER_ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    USER_NAME = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    USER_EMAIL = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    USER_PASSWORD = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    USER_ROLE = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_USERS", x => x.USER_ID);
                });

            migrationBuilder.CreateTable(
                name: "PATIENT_ROOM",
                columns: table => new
                {
                    PATIENT_ROOM_ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    PATIENT_ID = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    ROOM_ID = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    USER_ID = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    CREATED_AT = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PATIENT_ROOM", x => x.PATIENT_ROOM_ID);
                    table.ForeignKey(
                        name: "FK_PATIENT_ROOM_PATIENTS_PATIENT_ID",
                        column: x => x.PATIENT_ID,
                        principalTable: "PATIENTS",
                        principalColumn: "PATIENT_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PATIENT_ROOM_ROOMS_ROOM_ID",
                        column: x => x.ROOM_ID,
                        principalTable: "ROOMS",
                        principalColumn: "ROOM_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PATIENT_ROOM_USERS_USER_ID",
                        column: x => x.USER_ID,
                        principalTable: "USERS",
                        principalColumn: "USER_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TRANSACTIONS",
                columns: table => new
                {
                    TRANSACTION_ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    TOTAL_COST = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false),
                    ISPAID = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    CREATED_AT = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    MEDICINE_ID = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    PATIENT_ROOM_ID = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    Quantity = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TRANSACTIONS", x => x.TRANSACTION_ID);
                    table.ForeignKey(
                        name: "FK_TRANSACTIONS_MEDICINES_MEDICINE_ID",
                        column: x => x.MEDICINE_ID,
                        principalTable: "MEDICINES",
                        principalColumn: "MEDICINE_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TRANSACTIONS_PATIENT_ROOM_PATIENT_ROOM_ID",
                        column: x => x.PATIENT_ROOM_ID,
                        principalTable: "PATIENT_ROOM",
                        principalColumn: "PATIENT_ROOM_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TREATMENTS",
                columns: table => new
                {
                    TREATMENT_ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    PATIENT_ROOM_ID = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    TYPE = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    TOTAL_COST = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false),
                    CREATED_AT = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    ISPAID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TREATMENTS", x => x.TREATMENT_ID);
                    table.ForeignKey(
                        name: "FK_TREATMENTS_PATIENT_ROOM_PATIENT_ROOM_ID",
                        column: x => x.PATIENT_ROOM_ID,
                        principalTable: "PATIENT_ROOM",
                        principalColumn: "PATIENT_ROOM_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PATIENT_ROOM_PATIENT_ID",
                table: "PATIENT_ROOM",
                column: "PATIENT_ID");

            migrationBuilder.CreateIndex(
                name: "IX_PATIENT_ROOM_ROOM_ID",
                table: "PATIENT_ROOM",
                column: "ROOM_ID");

            migrationBuilder.CreateIndex(
                name: "IX_PATIENT_ROOM_USER_ID",
                table: "PATIENT_ROOM",
                column: "USER_ID");

            migrationBuilder.CreateIndex(
                name: "IX_TRANSACTIONS_MEDICINE_ID",
                table: "TRANSACTIONS",
                column: "MEDICINE_ID");

            migrationBuilder.CreateIndex(
                name: "IX_TRANSACTIONS_PATIENT_ROOM_ID",
                table: "TRANSACTIONS",
                column: "PATIENT_ROOM_ID");

            migrationBuilder.CreateIndex(
                name: "IX_TREATMENTS_PATIENT_ROOM_ID",
                table: "TREATMENTS",
                column: "PATIENT_ROOM_ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TRANSACTIONS");

            migrationBuilder.DropTable(
                name: "TREATMENTS");

            migrationBuilder.DropTable(
                name: "MEDICINES");

            migrationBuilder.DropTable(
                name: "PATIENT_ROOM");

            migrationBuilder.DropTable(
                name: "PATIENTS");

            migrationBuilder.DropTable(
                name: "ROOMS");

            migrationBuilder.DropTable(
                name: "USERS");
        }
    }
}
