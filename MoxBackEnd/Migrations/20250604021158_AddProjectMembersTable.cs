using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MoxBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectMembersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectUsers_AspNetUsers_UsersId",
                table: "ProjectUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectUsers_Projects_ProjectsProjectID",
                table: "ProjectUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectUsers",
                table: "ProjectUsers");

            migrationBuilder.RenameTable(
                name: "ProjectUsers",
                newName: "ProjectAssignments");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectUsers_UsersId",
                table: "ProjectAssignments",
                newName: "IX_ProjectAssignments_UsersId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectAssignments",
                table: "ProjectAssignments",
                columns: new[] { "ProjectsProjectID", "UsersId" });

            migrationBuilder.CreateTable(
                name: "ProjectMembers",
                columns: table => new
                {
                    ProjectID = table.Column<int>(type: "integer", nullable: false),
                    UserID = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectMembers", x => new { x.ProjectID, x.UserID });
                    table.ForeignKey(
                        name: "FK_ProjectMembers_AspNetUsers_UserID",
                        column: x => x.UserID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectMembers_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ProjectID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMembers_UserID",
                table: "ProjectMembers",
                column: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectAssignments_AspNetUsers_UsersId",
                table: "ProjectAssignments",
                column: "UsersId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectAssignments_Projects_ProjectsProjectID",
                table: "ProjectAssignments",
                column: "ProjectsProjectID",
                principalTable: "Projects",
                principalColumn: "ProjectID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectAssignments_AspNetUsers_UsersId",
                table: "ProjectAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectAssignments_Projects_ProjectsProjectID",
                table: "ProjectAssignments");

            migrationBuilder.DropTable(
                name: "ProjectMembers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectAssignments",
                table: "ProjectAssignments");

            migrationBuilder.RenameTable(
                name: "ProjectAssignments",
                newName: "ProjectUsers");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectAssignments_UsersId",
                table: "ProjectUsers",
                newName: "IX_ProjectUsers_UsersId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectUsers",
                table: "ProjectUsers",
                columns: new[] { "ProjectsProjectID", "UsersId" });

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectUsers_AspNetUsers_UsersId",
                table: "ProjectUsers",
                column: "UsersId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectUsers_Projects_ProjectsProjectID",
                table: "ProjectUsers",
                column: "ProjectsProjectID",
                principalTable: "Projects",
                principalColumn: "ProjectID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
