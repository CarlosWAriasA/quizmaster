using QuizMaster.Models;

namespace QuizMaster.Services.Quiz
{
    public interface IQuizService
    {
        Task<List<Entities.Quiz>> List();
        Task<List<Entities.Quiz>> ListByUser(int userId);
        Task<Entities.Quiz?> GetById(int quizId, int userId);
        Task<Entities.Quiz?> GetByCode(string code, int userId);
        void Validate(QuizDTO model);
        Task<Entities.Quiz?> Create(QuizDTO model);
        Task<Entities.Quiz?> Update(QuizDTO model);
        Task<Entities.QuizResult?> Complete(QuizResultDTO model);
        Task Delete(int quizId);
    }
}
