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
                Quiz? newNote = await quizService.Update(model);

                return Ok(newNote);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
