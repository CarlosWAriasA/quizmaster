using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using QuizMaster.Entities;
using QuizMaster.Models;
using QuizMaster.Services.Quiz;
using QuizMaster.Helpers;

namespace QuizMaster.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController(IQuizService quizService) : ControllerBase
    {
        [Authorize]
        [HttpGet("list")]
        public async Task<IActionResult> List()
        {
            try
            {
                string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                int userNumberId = Convert.ToInt32(userId);

                List<Quiz> quizzes = await quizService.List(userNumberId);
                List<QuizDTO> dtos = quizzes.Select(MapperHelper.ToQuizDto).ToList();

                return ApiResponse.Success(dtos);
            }
            catch (Exception ex)
            {
                return ApiResponse.Exception(ex);
            }
        }

        [Authorize]
        [HttpGet("{quizId}")]
        public async Task<IActionResult> GetById(int quizId)
        {
            try
            {
                string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                int userNumberId = Convert.ToInt32(userId);
                Entities.Quiz? quiz = await quizService.GetById(quizId, userNumberId);

                if (quiz == null)
                {
                    return ApiResponse.Error("Quiz not found", 404);
                }

                QuizDTO dto = MapperHelper.ToQuizDto(quiz);

                return ApiResponse.Success(dto);
            }
            catch (Exception ex)
            {
                return ApiResponse.Exception(ex);
            }
        }


        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> Create(QuizDTO model)
        {
            try
            {
                string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                int userNumberId = Convert.ToInt32(userId);
                model.UserId = userNumberId;
                Quiz? newQuiz = await quizService.Create(model);

                if (newQuiz == null)
                    return ApiResponse.Error("Could not create quiz");

                QuizDTO dto = MapperHelper.ToQuizDto(newQuiz);
                return ApiResponse.Success(dto);
            }
            catch (Exception ex)
            {
                return ApiResponse.Exception(ex);
            }
        }

        [Authorize]
        [HttpPost("update")]
        public async Task<IActionResult> Update(QuizDTO model)
        {
            try
            {
                string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                int userNumberId = Convert.ToInt32(userId);
                model.UserId = userNumberId;
                Quiz? updatedQuiz = await quizService.Update(model);
                if (updatedQuiz == null)
                    return ApiResponse.Error("Could not update quiz");
                QuizDTO dto = MapperHelper.ToQuizDto(updatedQuiz);
                return ApiResponse.Success(dto);
            }
            catch (Exception ex)
            {
                return ApiResponse.Exception(ex);
            }
        }

        [Authorize]
        [HttpDelete("{quizId}")]
        public async Task<IActionResult> Delete(int quizId)
        {
            try
            {
                await quizService.Delete(quizId);
                return ApiResponse.Success("Quiz deleted successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse.Exception(ex);
            }
        }

    }
}
