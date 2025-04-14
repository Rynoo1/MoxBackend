using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MoxBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class RelationshipSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SubTasks_Users_AssignedUserID",
                table: "SubTasks");

            migrationBuilder.DropIndex(
                name: "IX_SubTasks_AssignedUserID",
                table: "SubTasks");

            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "AssignedUserID",
                table: "SubTasks");

            migrationBuilder.RenameColumn(
                name: "IsCompleted",
                table: "SubTasks",
                newName: "IsEmergency");

            migrationBuilder.RenameColumn(
                name: "TaskID",
                table: "SubTasks",
                newName: "SubTaskID");

            migrationBuilder.AddColumn<int>(
                name: "ProjectsId",
                table: "Tasks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Tasks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProjectsId",
                table: "SubTasks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SubTStatus",
                table: "SubTasks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "SubTaskUserAssignments",
                columns: table => new
                {
                    AssignedSubTasksSubTaskID = table.Column<int>(type: "integer", nullable: false),
                    AssignedUsersUserID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubTaskUserAssignments", x => new { x.AssignedSubTasksSubTaskID, x.AssignedUsersUserID });
                    table.ForeignKey(
                        name: "FK_SubTaskUserAssignments_SubTasks_AssignedSubTasksSubTaskID",
                        column: x => x.AssignedSubTasksSubTaskID,
                        principalTable: "SubTasks",
                        principalColumn: "SubTaskID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SubTaskUserAssignments_Users_AssignedUsersUserID",
                        column: x => x.AssignedUsersUserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ProjectsId",
                table: "Tasks",
                column: "ProjectsId");

            migrationBuilder.CreateIndex(
                name: "IX_SubTasks_ParentTaskId",
                table: "SubTasks",
                column: "ParentTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_SubTasks_ProjectsId",
                table: "SubTasks",
                column: "ProjectsId");

            migrationBuilder.CreateIndex(
                name: "IX_SubTaskUserAssignments_AssignedUsersUserID",
                table: "SubTaskUserAssignments",
                column: "AssignedUsersUserID");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SubTasks_Projects_ProjectsId",
                table: "SubTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_SubTasks_Tasks_ParentTaskId",
                table: "SubTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Projects_ProjectsId",
                table: "Tasks");

            migrationBuilder.DropTable(
                name: "SubTaskUserAssignments");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_ProjectsId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_SubTasks_ParentTaskId",
                table: "SubTasks");

            migrationBuilder.DropIndex(
                name: "IX_SubTasks_ProjectsId",
                table: "SubTasks");

            migrationBuilder.DropColumn(
                name: "ProjectsId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "ProjectsId",
                table: "SubTasks");

            migrationBuilder.DropColumn(
                name: "SubTStatus",
                table: "SubTasks");

            migrationBuilder.RenameColumn(
                name: "IsEmergency",
                table: "SubTasks",
                newName: "IsCompleted");

            migrationBuilder.RenameColumn(
                name: "SubTaskID",
                table: "SubTasks",
                newName: "TaskID");

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "Tasks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "AssignedUserID",
                table: "SubTasks",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SubTasks_AssignedUserID",
                table: "SubTasks",
                column: "AssignedUserID");

            migrationBuilder.AddForeignKey(
                name: "FK_SubTasks_Users_AssignedUserID",
                table: "SubTasks",
                column: "AssignedUserID",
                principalTable: "Users",
                principalColumn: "UserID");
        }
    }
}
