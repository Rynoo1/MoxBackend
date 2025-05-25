using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MoxBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class RemoveGroupAndUpdateProjectUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppRoles_Groups_GroupID",
                table: "AppRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_EmergencyMeetings_Groups_GroupID",
                table: "EmergencyMeetings");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Groups_GroupID",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectsUsers_AspNetUsers_UsersId",
                table: "ProjectsUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectsUsers_Projects_ProjectsProjectID",
                table: "ProjectsUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Groups_GroupID",
                table: "Tasks");

            migrationBuilder.DropTable(
                name: "GroupUsers");

            migrationBuilder.DropTable(
                name: "Groups");

            migrationBuilder.DropIndex(
                name: "IX_Projects_GroupID",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_EmergencyMeetings_GroupID",
                table: "EmergencyMeetings");

            migrationBuilder.DropIndex(
                name: "IX_AppRoles_GroupID",
                table: "AppRoles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectsUsers",
                table: "ProjectsUsers");

            migrationBuilder.DropColumn(
                name: "GroupID",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "GroupID",
                table: "EmergencyMeetings");

            migrationBuilder.DropColumn(
                name: "GroupID",
                table: "AppRoles");

            migrationBuilder.RenameTable(
                name: "ProjectsUsers",
                newName: "ProjectUsers");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectsUsers_UsersId",
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectUsers_AspNetUsers_UsersId",
                table: "ProjectUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectUsers_Projects_ProjectsProjectID",
                table: "ProjectUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_AspNetUsers_AssignedUserId",
                table: "Tasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectUsers",
                table: "ProjectUsers");

            migrationBuilder.RenameTable(
                name: "ProjectUsers",
                newName: "ProjectsUsers");

            migrationBuilder.RenameColumn(
                name: "AssignedUserId",
                table: "Tasks",
                newName: "GroupID");

            migrationBuilder.RenameIndex(
                name: "IX_Tasks_AssignedUserId",
                table: "Tasks",
                newName: "IX_Tasks_GroupID");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectUsers_UsersId",
                table: "ProjectsUsers",
                newName: "IX_ProjectsUsers_UsersId");

            migrationBuilder.AddColumn<string>(
                name: "GroupID",
                table: "Projects",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GroupID",
                table: "EmergencyMeetings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GroupID",
                table: "AppRoles",
                type: "text",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectsUsers",
                table: "ProjectsUsers",
                columns: new[] { "ProjectsProjectID", "UsersId" });

            migrationBuilder.CreateTable(
                name: "Groups",
                columns: table => new
                {
                    GroupID = table.Column<string>(type: "text", nullable: false),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    FileUploads = table.Column<string[]>(type: "text[]", nullable: false),
                    GroupName = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Groups", x => x.GroupID);
                });

            migrationBuilder.CreateTable(
                name: "GroupUsers",
                columns: table => new
                {
                    GroupsGroupID = table.Column<string>(type: "text", nullable: false),
                    UsersId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupUsers", x => new { x.GroupsGroupID, x.UsersId });
                    table.ForeignKey(
                        name: "FK_GroupUsers_AspNetUsers_UsersId",
                        column: x => x.UsersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GroupUsers_Groups_GroupsGroupID",
                        column: x => x.GroupsGroupID,
                        principalTable: "Groups",
                        principalColumn: "GroupID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_GroupID",
                table: "Projects",
                column: "GroupID");

            migrationBuilder.CreateIndex(
                name: "IX_EmergencyMeetings_GroupID",
                table: "EmergencyMeetings",
                column: "GroupID");

            migrationBuilder.CreateIndex(
                name: "IX_AppRoles_GroupID",
                table: "AppRoles",
                column: "GroupID");

            migrationBuilder.CreateIndex(
                name: "IX_GroupUsers_UsersId",
                table: "GroupUsers",
                column: "UsersId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppRoles_Groups_GroupID",
                table: "AppRoles",
                column: "GroupID",
                principalTable: "Groups",
                principalColumn: "GroupID",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_EmergencyMeetings_Groups_GroupID",
                table: "EmergencyMeetings",
                column: "GroupID",
                principalTable: "Groups",
                principalColumn: "GroupID",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Groups_GroupID",
                table: "Projects",
                column: "GroupID",
                principalTable: "Groups",
                principalColumn: "GroupID",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectsUsers_AspNetUsers_UsersId",
                table: "ProjectsUsers",
                column: "UsersId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectsUsers_Projects_ProjectsProjectID",
                table: "ProjectsUsers",
                column: "ProjectsProjectID",
                principalTable: "Projects",
                principalColumn: "ProjectID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Groups_GroupID",
                table: "Tasks",
                column: "GroupID",
                principalTable: "Groups",
                principalColumn: "GroupID",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
