using System.Security.Claims;
using QuizMaster.Services;
using QuizMaster.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizMaster.Entities;
using QuizMaster.Models;
using QuizMaster.Services.Note;

namespace QuizMaster.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NoteController(INoteService noteService) : ControllerBase
    {
        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> Create(NoteDTO model)
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int userNumberId = Convert.ToInt32(userId);
            model.UserId = userNumberId;
            Note? newNote = await noteService.Create(model);

            return Ok(newNote);
        }
    }
}
