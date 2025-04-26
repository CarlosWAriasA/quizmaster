using Microsoft.EntityFrameworkCore;
using QuizMaster.Data;
using QuizMaster.Entities;
using QuizMaster.Models;

namespace QuizMaster.Services.Quiz
{
    public class QuizService(DataContext context) : IQuizService
    {
        public async Task<Entities.Quiz?> Create(QuizDTO model)
        {
            try
            {
                Validate(model);

                Entities.Quiz newQuiz = new()
                {
                    Title = model.Title,                
                    Description = model.Description,
                    UserId = model.UserId,
                    DateCreated = DateTime.Now
                };

                foreach (QuizDTO.QuizQuestionDTO question in model.Questions)
                {
                    QuizQuestion newQuestion = new()
                    {
                        Title = question.Title,
                        DateCreated= DateTime.Now,                    
                    };

                    foreach (QuizDTO.QuizOptionDTO option in question.Options)
                    {
                        QuizOption newOption = new()
                        {
                            Title = option.Title,
                            DateCreated = DateTime.Now,
                            IsCorrect = option.IsCorrect,                        
                        };

                        newQuestion.Options.Add(newOption);
                    }

                    newQuiz.Questions.Add(newQuestion);
                }

                context.Quiz.Add(newQuiz);

                await context.SaveChangesAsync();

                return newQuiz;
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception("Ha ocurrido un error " + ex.Message);
            }
        }

        public async Task<List<Entities.Quiz>> List(int userId)
        {
            try
            {
                List<Entities.Quiz> quizzes = await context.Quiz
                    .Where(q => q.UserId == userId)
                    .Include(q => q.Questions)
                    .ThenInclude(q => q.Options)
                    .OrderByDescending(q => q.DateCreated)
                    .ToListAsync();

                return quizzes;
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving quizzes: " + ex.Message);
            }
        }


        public Task<Entities.Quiz?> Update(QuizDTO model)
        {
            throw new NotImplementedException();
        }

        public void Validate(QuizDTO model)
        {
            if (string.IsNullOrWhiteSpace(model.Title))
            {
                throw new ArgumentException("Title is required");
            }

            if (model.UserId <= 0)
            {
                throw new ArgumentException("User is required");
            }

            if (model.Questions == null || model.Questions.Count < 2)
            {
                throw new ArgumentException("Quiz must have at least 2 questions");
            }

            foreach (QuizDTO.QuizQuestionDTO question in model.Questions)
            {
                if (string.IsNullOrWhiteSpace(question.Title))
                {
                    throw new ArgumentException("All questions must have a title");
                }

                if (question.Options == null || question.Options.Count < 2)
                {
                    throw new ArgumentException("All questions must have at least 2 options");
                }

                foreach (QuizDTO.QuizOptionDTO option in question.Options) 
                {
                    if (string.IsNullOrWhiteSpace(option.Title))
                    {
                        throw new ArgumentException("All options must have a title");
                    }
                }
            }
        }
    }
}
