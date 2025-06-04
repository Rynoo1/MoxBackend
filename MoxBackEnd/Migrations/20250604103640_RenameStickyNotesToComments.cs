using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MoxBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class RenameStickyNotesToComments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "StickyNotes",
                newName: "Comments"
            );

            migrationBuilder.RenameColumn(
                name: "NoteID",
                table: "Comments",
                newName: "CommentID"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CommentID",
                table: "Comments",
                newName: "NoteID"
            );

            migrationBuilder.RenameTable(
                name: "Comments",
                newName: "StickyNotes"
            );
        }
    }
}