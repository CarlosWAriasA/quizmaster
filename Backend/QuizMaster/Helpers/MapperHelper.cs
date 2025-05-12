using QuizMaster.Entities;
using QuizMaster.Models;

namespace QuizMaster.Helpers
{
    public static class MapperHelper
    {
        public static QuizDTO? ToQuizDto(Quiz? entity = null)
        {
            if (entity == null) return null;
            return new QuizDTO
            {
                Id = entity.Id,
                Title = entity.Title,
                Description = entity.Description,
                Code = entity.Code,
                UserId = entity.UserId,
                DateCreated = entity.DateCreated,
                LastUpdate = entity.LastUpdate,
                Questions = entity.Questions?.Select(q => new QuizDTO.QuizQuestionDTO
                {
                    Id = q.Id,
                    Title = q.Title,
                    QuizId = q.QuizId,
                    Options = q.Options?.Select(o => new QuizDTO.QuizOptionDTO
                    {
                        Id = o.Id,
                        Title = o.Title,
                        IsCorrect = o.IsCorrect,
                        QuestionId = o.QuestionId
                    }).ToList() ?? []
                }).ToList() ?? []
            };
        }

        public static QuizResultDTO ToQuizResultDto(QuizResult entity)
        {
            return new QuizResultDTO
            {
                Id = entity.Id,
                QuizId = entity.QuizId,
                UserId = entity.UserId,
                Score = entity.Score,
                TotalQuestions = entity.TotalQuestions,
                Percentage = entity.Percentage,
                StartTime = entity.StartTime,
                EndTime = entity.EndTime,
                DurationSeconds = entity.DurationSeconds,
                Quiz = ToQuizDto(entity.Quiz)
            };
        }

    }
}
