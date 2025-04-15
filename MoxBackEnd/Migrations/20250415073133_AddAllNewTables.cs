using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MoxBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class AddAllNewTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Projects_ProjectsID",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_SubTasks_Projects_ProjectsId",
                table: "SubTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_SubTasks_Tasks_ParentTaskId",
                table: "SubTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Projects_ProjectsId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_ProjectsID",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ProjectsID",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "ProjectsId",
                table: "Tasks",
                newName: "ProjectID");

            migrationBuilder.RenameIndex(
                name: "IX_Tasks_ProjectsId",
                table: "Tasks",
                newName: "IX_Tasks_ProjectID");

            migrationBuilder.RenameColumn(
                name: "ProjectsId",
                table: "SubTasks",
                newName: "ProjectID");

            migrationBuilder.RenameColumn(
                name: "ParentTaskId",
                table: "SubTasks",
                newName: "TaskId");

            migrationBuilder.RenameIndex(
                name: "IX_SubTasks_ProjectsId",
                table: "SubTasks",
                newName: "IX_SubTasks_ProjectID");

            migrationBuilder.RenameIndex(
                name: "IX_SubTasks_ParentTaskId",
                table: "SubTasks",
                newName: "IX_SubTasks_TaskId");

            migrationBuilder.RenameColumn(
                name: "ProjectsID",
                table: "Projects",
                newName: "ProjectID");

            migrationBuilder.AddColumn<string>(
                name: "GroupID",
                table: "Tasks",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GroupID",
                table: "Projects",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GroupID",
                table: "AppRoles",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Groups",
                columns: table => new
                {
                    GroupID = table.Column<string>(type: "text", nullable: false),
                    GroupName = table.Column<string>(type: "text", nullable: false),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    FileUploads = table.Column<string[]>(type: "text[]", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Groups", x => x.GroupID);
                });

            migrationBuilder.CreateTable(
                name: "ProjectsUsers",
                columns: table => new
                {
                    ProjectsProjectID = table.Column<int>(type: "integer", nullable: false),
                    UsersId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectsUsers", x => new { x.ProjectsProjectID, x.UsersId });
                    table.ForeignKey(
                        name: "FK_ProjectsUsers_AspNetUsers_UsersId",
                        column: x => x.UsersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectsUsers_Projects_ProjectsProjectID",
                        column: x => x.ProjectsProjectID,
                        principalTable: "Projects",
                        principalColumn: "ProjectID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StickyNotes",
                columns: table => new
                {
                    NoteID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Content = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ColorHex = table.Column<string>(type: "text", nullable: true),
                    TaskId = table.Column<int>(type: "integer", nullable: true),
                    ProjectID = table.Column<int>(type: "integer", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StickyNotes", x => x.NoteID);
                    table.ForeignKey(
                        name: "FK_StickyNotes_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_StickyNotes_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ProjectID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_StickyNotes_Tasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "Tasks",
                        principalColumn: "TaskId");
                });

            migrationBuilder.CreateTable(
                name: "EmergencyMeetings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    StartTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: true),
                    GroupID = table.Column<string>(type: "text", nullable: true),
                    ProjectID = table.Column<int>(type: "integer", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: false),
                    IsResolved = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmergencyMeetings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmergencyMeetings_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EmergencyMeetings_Groups_GroupID",
                        column: x => x.GroupID,
                        principalTable: "Groups",
                        principalColumn: "GroupID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_EmergencyMeetings_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ProjectID",
                        onDelete: ReferentialAction.SetNull);
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

            migrationBuilder.CreateTable(
                name: "EmergencyMeetingUsers",
                columns: table => new
                {
                    AttendeesId = table.Column<string>(type: "text", nullable: false),
                    MeetingsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmergencyMeetingUsers", x => new { x.AttendeesId, x.MeetingsId });
                    table.ForeignKey(
                        name: "FK_EmergencyMeetingUsers_AspNetUsers_AttendeesId",
                        column: x => x.AttendeesId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmergencyMeetingUsers_EmergencyMeetings_MeetingsId",
                        column: x => x.MeetingsId,
                        principalTable: "EmergencyMeetings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_GroupID",
                table: "Tasks",
                column: "GroupID");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_GroupID",
                table: "Projects",
                column: "GroupID");

            migrationBuilder.CreateIndex(
                name: "IX_AppRoles_GroupID",
                table: "AppRoles",
                column: "GroupID");

            migrationBuilder.CreateIndex(
                name: "IX_EmergencyMeetings_CreatedByUserId",
                table: "EmergencyMeetings",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_EmergencyMeetings_GroupID",
                table: "EmergencyMeetings",
                column: "GroupID");

            migrationBuilder.CreateIndex(
                name: "IX_EmergencyMeetings_ProjectID",
                table: "EmergencyMeetings",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_EmergencyMeetingUsers_MeetingsId",
                table: "EmergencyMeetingUsers",
                column: "MeetingsId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupUsers_UsersId",
                table: "GroupUsers",
                column: "UsersId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectsUsers_UsersId",
                table: "ProjectsUsers",
                column: "UsersId");

            migrationBuilder.CreateIndex(
                name: "IX_StickyNotes_CreatedByUserId",
                table: "StickyNotes",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_StickyNotes_ProjectID",
                table: "StickyNotes",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_StickyNotes_TaskId",
                table: "StickyNotes",
                column: "TaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppRoles_Groups_GroupID",
                table: "AppRoles",
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
                name: "FK_SubTasks_Projects_ProjectID",
                table: "SubTasks",
                column: "ProjectID",
                principalTable: "Projects",
                principalColumn: "ProjectID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SubTasks_Tasks_TaskId",
                table: "SubTasks",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "TaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Groups_GroupID",
                table: "Tasks",
                column: "GroupID",
                principalTable: "Groups",
                principalColumn: "GroupID",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Projects_ProjectID",
                table: "Tasks",
                column: "ProjectID",
                principalTable: "Projects",
                principalColumn: "ProjectID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppRoles_Groups_GroupID",
                table: "AppRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Groups_GroupID",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_SubTasks_Projects_ProjectID",
                table: "SubTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_SubTasks_Tasks_TaskId",
                table: "SubTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Groups_GroupID",
                table: "Tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Projects_ProjectID",
                table: "Tasks");

            migrationBuilder.DropTable(
                name: "EmergencyMeetingUsers");

            migrationBuilder.DropTable(
                name: "GroupUsers");

            migrationBuilder.DropTable(
                name: "ProjectsUsers");

            migrationBuilder.DropTable(
                name: "StickyNotes");

            migrationBuilder.DropTable(
                name: "EmergencyMeetings");

            migrationBuilder.DropTable(
                name: "Groups");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_GroupID",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Projects_GroupID",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_AppRoles_GroupID",
                table: "AppRoles");

            migrationBuilder.DropColumn(
                name: "GroupID",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "GroupID",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "GroupID",
                table: "AppRoles");

            migrationBuilder.RenameColumn(
                name: "ProjectID",
                table: "Tasks",
                newName: "ProjectsId");

            migrationBuilder.RenameIndex(
                name: "IX_Tasks_ProjectID",
                table: "Tasks",
                newName: "IX_Tasks_ProjectsId");

            migrationBuilder.RenameColumn(
                name: "TaskId",
                table: "SubTasks",
                newName: "ParentTaskId");

            migrationBuilder.RenameColumn(
                name: "ProjectID",
                table: "SubTasks",
                newName: "ProjectsId");

            migrationBuilder.RenameIndex(
                name: "IX_SubTasks_TaskId",
                table: "SubTasks",
                newName: "IX_SubTasks_ParentTaskId");

            migrationBuilder.RenameIndex(
                name: "IX_SubTasks_ProjectID",
                table: "SubTasks",
                newName: "IX_SubTasks_ProjectsId");

            migrationBuilder.RenameColumn(
                name: "ProjectID",
                table: "Projects",
                newName: "ProjectsID");

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

            migrationBuilder.AddForeignKey(
                name: "FK_SubTasks_Projects_ProjectsId",
                table: "SubTasks",
                column: "ProjectsId",
                principalTable: "Projects",
                principalColumn: "ProjectsID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SubTasks_Tasks_ParentTaskId",
                table: "SubTasks",
                column: "ParentTaskId",
                principalTable: "Tasks",
                principalColumn: "TaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Projects_ProjectsId",
                table: "Tasks",
                column: "ProjectsId",
                principalTable: "Projects",
                principalColumn: "ProjectsID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
