using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiAuthenticacion.Migrations
{
    /// <inheritdoc />
    public partial class AddingRandomFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "RandomOptions",
                table: "QuizQuestion",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RandomQuestions",
                table: "Quiz",
                type: "bit",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuizResult_QuizId",
                table: "QuizResult",
                column: "QuizId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuizResult_Quiz_QuizId",
                table: "QuizResult",
                column: "QuizId",
                principalTable: "Quiz",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuizResult_Quiz_QuizId",
                table: "QuizResult");

            migrationBuilder.DropIndex(
                name: "IX_QuizResult_QuizId",
                table: "QuizResult");

            migrationBuilder.DropColumn(
                name: "RandomOptions",
                table: "QuizQuestion");

            migrationBuilder.DropColumn(
                name: "RandomQuestions",
                table: "Quiz");
        }
    }
}
