using QuizMaster.Models;

namespace QuizMaster.Services.Quiz
{
    public interface IQuizService
    {
        Task<List<Entities.Quiz>> List(int userId);
        Task<Entities.Quiz?> GetById(int quizId, int userId);
        void Validate(QuizDTO model);
        Task<Entities.Quiz?> Create(QuizDTO model);
        Task<Entities.Quiz?> Update(QuizDTO model);
        Task Delete(int quizId);
    }
}
