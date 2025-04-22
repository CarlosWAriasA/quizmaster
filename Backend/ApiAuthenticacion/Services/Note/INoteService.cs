using QuizMaster.Models;

namespace QuizMaster.Services.Note
{
    public interface INoteService
    {
        Task<Entities.Note?> Create(NoteDTO model);
    }
}
