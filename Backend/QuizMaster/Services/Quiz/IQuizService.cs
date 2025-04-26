using QuizMaster.Models;

namespace QuizMaster.Services.Quiz
{
    public interface IQuizService
    {
        Task<List<Entities.Quiz>> List(int userId);
        void Validate(QuizDTO model);
        Task<Entities.Quiz?> Create(QuizDTO model);
        Task<Entities.Quiz?> Update(QuizDTO model);
    }
}
