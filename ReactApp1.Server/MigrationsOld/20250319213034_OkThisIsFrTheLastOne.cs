using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApp1.Server.Migrations
{
    /// <inheritdoc />
    public partial class OkThisIsFrTheLastOne : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Film",
                columns: table => new
                {
                    id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Cim = table.Column<string>(type: "TEXT", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Kategoria = table.Column<string>(type: "TEXT", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Mufaj = table.Column<string>(type: "TEXT", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Korhatar = table.Column<string>(type: "TEXT", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Jatekido = table.Column<int>(type: "INT(4)", nullable: false),
                    Gyarto = table.Column<string>(type: "TEXT", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Rendezo = table.Column<string>(type: "TEXT", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Szereplok = table.Column<string>(type: "TEXT", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Leiras = table.Column<string>(type: "TEXT", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EredetiNyelv = table.Column<string>(type: "TEXT", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EredetiCim = table.Column<string>(type: "TEXT", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Szinkron = table.Column<string>(type: "TEXT", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TrailerLink = table.Column<string>(type: "TEXT", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IMDB = table.Column<string>(type: "TEXT", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AlapAr = table.Column<int>(type: "INT(11)", nullable: false),
                    Megjegyzes = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Film", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Terem",
                columns: table => new
                {
                    id = table.Column<int>(type: "int(5)", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Nev = table.Column<string>(type: "text", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Megjegyzes = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Terem", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    userID = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    email = table.Column<string>(type: "varchar(100)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    passwordHash = table.Column<string>(type: "char(84)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    creationDate = table.Column<DateTime>(type: "DateTime", nullable: false),
                    accountStatus = table.Column<int>(type: "int(1)", maxLength: 1, nullable: false),
                    role = table.Column<string>(type: "varchar(30)", maxLength: 1, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Megjegyzes = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    refreshToken = table.Column<string>(type: "varchar(100)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    refreshTokenExpiry = table.Column<DateTime>(type: "DateTime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.userID);
                    table.UniqueConstraint("UK_Users_Email", x => x.email);
                    table.UniqueConstraint("UK_Users_refreshToken", x => x.refreshToken);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Szekek",
                columns: table => new
                {
                    Teremid = table.Column<int>(type: "int(5)", nullable: false),
                    X = table.Column<int>(type: "int(2)", nullable: false),
                    Y = table.Column<int>(type: "int(2)", nullable: false),
                    Allapot = table.Column<int>(type: "int(1)", nullable: false),
                    Megjegyzes = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Szekek", x => new { x.Teremid, x.X, x.Y });
                    table.ForeignKey(
                        name: "FK_Szekek_Terem_Teremid",
                        column: x => x.Teremid,
                        principalTable: "Terem",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Vetites",
                columns: table => new
                {
                    id = table.Column<int>(type: "int(5)", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Idopont = table.Column<DateTime>(type: "DateTime", nullable: false),
                    Megjegyzes = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Filmid = table.Column<int>(type: "int(11)", nullable: false),
                    Teremid = table.Column<int>(type: "int(5)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vetites", x => x.id);
                    table.ForeignKey(
                        name: "FK_Vetites_Film_Filmid",
                        column: x => x.Filmid,
                        principalTable: "Film",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Vetites_Terem_Teremid",
                        column: x => x.Teremid,
                        principalTable: "Terem",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FoglalasAdatok",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserID = table.Column<int>(type: "int(11)", nullable: false),
                    FoglalasIdopontja = table.Column<DateTime>(type: "DateTime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FoglalasAdatok", x => x.id);
                    table.ForeignKey(
                        name: "FK_FoglalasAdatok_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "userID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FoglaltSzekek",
                columns: table => new
                {
                    Teremid = table.Column<int>(type: "int", nullable: false),
                    X = table.Column<int>(type: "int", nullable: false),
                    Y = table.Column<int>(type: "int", nullable: false),
                    Vetitesid = table.Column<int>(type: "int", nullable: false),
                    FoglalasAdatokid = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FoglaltSzekek", x => new { x.Teremid, x.X, x.Y, x.Vetitesid, x.FoglalasAdatokid });
                    table.ForeignKey(
                        name: "FK_FoglaltSzekek_FoglalasAdatok_FoglalasAdatokid",
                        column: x => x.FoglalasAdatokid,
                        principalTable: "FoglalasAdatok",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "VetitesSzekek",
                columns: table => new
                {
                    Teremid = table.Column<int>(type: "int(5)", nullable: false),
                    X = table.Column<int>(type: "int(2)", nullable: false),
                    Y = table.Column<int>(type: "int(2)", nullable: false),
                    Vetitesid = table.Column<int>(type: "int(5)", nullable: false),
                    FoglalasAllapot = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VetitesSzekek", x => new { x.Teremid, x.X, x.Y, x.Vetitesid });
                    table.ForeignKey(
                        name: "FK_VetitesSzekek_FoglaltSzekek_Teremid_X_Y_Vetitesid",
                        columns: x => new { x.Teremid, x.X, x.Y, x.Vetitesid },
                        principalTable: "FoglaltSzekek",
                        principalColumns: new[] { "Teremid", "X", "Y", "Vetitesid" },
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VetitesSzekek_Szekek_Teremid_X_Y",
                        columns: x => new { x.Teremid, x.X, x.Y },
                        principalTable: "Szekek",
                        principalColumns: new[] { "Teremid", "X", "Y" },
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VetitesSzekek_Vetites_Vetitesid",
                        column: x => x.Vetitesid,
                        principalTable: "Vetites",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_FoglalasAdatok_UserID",
                table: "FoglalasAdatok",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_FoglaltSzekek_FoglalasAdatokid",
                table: "FoglaltSzekek",
                column: "FoglalasAdatokid");

            migrationBuilder.CreateIndex(
                name: "IX_Vetites_Filmid",
                table: "Vetites",
                column: "Filmid");

            migrationBuilder.CreateIndex(
                name: "IX_Vetites_Teremid",
                table: "Vetites",
                column: "Teremid");

            migrationBuilder.CreateIndex(
                name: "IX_VetitesSzekek_Vetitesid",
                table: "VetitesSzekek",
                column: "Vetitesid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VetitesSzekek");

            migrationBuilder.DropTable(
                name: "FoglaltSzekek");

            migrationBuilder.DropTable(
                name: "Szekek");

            migrationBuilder.DropTable(
                name: "Vetites");

            migrationBuilder.DropTable(
                name: "FoglalasAdatok");

            migrationBuilder.DropTable(
                name: "Film");

            migrationBuilder.DropTable(
                name: "Terem");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
