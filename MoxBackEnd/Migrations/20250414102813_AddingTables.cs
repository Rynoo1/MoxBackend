using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MoxBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class AddingTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProjectsID",
                table: "AspNetUsers",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_ProjectsID",
                table: "AspNetUsers",
                column: "ProjectsID");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Projects_ProjectsID",
                table: "AspNetUsers",
                column: "ProjectsID",
                principalTable: "Projects",
                principalColumn: "ProjectsID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Projects_ProjectsID",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_ProjectsID",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ProjectsID",
                table: "AspNetUsers");
        }
    }
}
