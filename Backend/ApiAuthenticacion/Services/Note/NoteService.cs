using QuizMaster.Services.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QuizMaster.Data;
using QuizMaster.Models;

namespace QuizMaster.Services.Note
{
    public class NoteService(DataContext context) : INoteService
    {
        public async Task<Entities.Note?> Create(NoteDTO model)
        {
            Entities.Note newNote = new()
            {
                Description = model.Description,
                UserId = model.UserId,
                DateCreated = DateTime.Now
            };

            context.Notes.Add(newNote);

            await context.SaveChangesAsync();

            return newNote;
        }
    }
}
