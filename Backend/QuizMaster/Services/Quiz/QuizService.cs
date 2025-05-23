﻿using Microsoft.EntityFrameworkCore;
using QuizMaster.Data;
using QuizMaster.Entities;
using QuizMaster.Models;

namespace QuizMaster.Services.Quiz
{
    public class QuizService(DataContext context) : IQuizService
    {
        public async Task Delete(int quizId)
        {
            try
            {
                Entities.Quiz? quiz = await context.Quiz
                    .Include(q => q.Questions)
                    .ThenInclude(q => q.Options)
                    .FirstOrDefaultAsync(q => q.Id == quizId);

                if (quiz == null)
                {
                    throw new ArgumentException("Quiz not found.");
                }

                context.Quiz.Remove(quiz);
                await context.SaveChangesAsync();
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the quiz: " + ex.Message);
            }
        }

        public async Task<Entities.Quiz?> GetById(int quizId, int userId)
        {
            try
            {
                Entities.Quiz? quiz = await context.Quiz.Include(q => q.Questions).ThenInclude(q => q.Options).FirstOrDefaultAsync(q => q.Id == quizId && q.UserId == userId);

                return quiz;
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving quiz: " + ex.Message);
            }
        }

        public async Task<Entities.Quiz?> GetByCode(string code, int userId)
        {
            try
            {
                Entities.Quiz? quiz = await context.Quiz.Include(q => q.Questions).ThenInclude(q => q.Options).FirstOrDefaultAsync(q => q.Code == code && q.UserId == userId);

                return quiz;
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving quiz: " + ex.Message);
            }
        }

        public async Task<List<Entities.Quiz>> List()
        {
            try
            {
                List<Entities.Quiz> quizzes = await context.Quiz                    
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
        
        public async Task<List<Entities.QuizResult>> GetResults(int userId)
        {
            try
            {
                List<Entities.QuizResult> quizzes = await context.QuizResult                    
                    .Include(q => q.Quiz)
                    .OrderByDescending(q => q.StartTime)
                    .ToListAsync();

                return quizzes;
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving quizzes: " + ex.Message);
            }
        }

        public async Task<List<Entities.Quiz>> ListByUser(int userId)
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
                throw new Exception("Error retrieving quizzes by user: " + ex.Message);
            }
        }

        public async Task<Entities.Quiz?> Create(QuizDTO model)
        {
            try
            {
                Validate(model);

                Entities.Quiz newQuiz = new()
                {
                    Title = model.Title,
                    Description = model.Description,
                    Code = GenerateCode(),
                    UserId = model.UserId,
                    RandomQuestions = model.RandomQuestions,
                    DateCreated = DateTime.Now
                };

                foreach (QuizDTO.QuizQuestionDTO question in model.Questions)
                {
                    QuizQuestion newQuestion = new()
                    {
                        Title = question.Title,
                        RandomOptions = question.RandomOptions,
                        DateCreated = DateTime.Now,
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

        public async Task<Entities.Quiz?> Update(QuizDTO model)
        {
            try
            {
                Entities.Quiz? existingQuiz = await context.Quiz
                    .Include(q => q.Questions).ThenInclude(q => q.Options)
                    .FirstOrDefaultAsync(q => q.Id == model.Id) ?? throw new ArgumentException("Quiz not found");

                if (existingQuiz.UserId != model.UserId)
                {
                    throw new ArgumentException("You can only edit quizzes you have created.");
                }

                existingQuiz.Title = model.Title;
                existingQuiz.Description = model.Description;
                existingQuiz.RandomQuestions = model.RandomQuestions;

                if (string.IsNullOrWhiteSpace(existingQuiz.Code))
                {
                    existingQuiz.Code = GenerateCode();
                }

                HashSet<int> updatedQuestionIds = [];

                foreach (var questionDto in model.Questions)
                {
                    QuizQuestion? existingQuestion = existingQuiz.Questions.FirstOrDefault(q => q.Id == questionDto.Id);

                    if (existingQuestion != null)
                    {
                        existingQuestion.Title = questionDto.Title;
                        existingQuestion.LastUpdate = DateTime.Now;
                        existingQuestion.RandomOptions = questionDto.RandomOptions;
                        updatedQuestionIds.Add(existingQuestion.Id);

                        
                        HashSet<int> updatedOptionIds = [];

                        foreach (var optionDto in questionDto.Options)
                        {
                            QuizOption? existingOption = existingQuestion.Options.FirstOrDefault(o => o.Id == optionDto.Id);

                            if (existingOption != null)
                            {
                                existingOption.Title = optionDto.Title;
                                existingOption.IsCorrect = optionDto.IsCorrect;
                                existingOption.LastUpdate = DateTime.Now;
                                updatedOptionIds.Add(existingOption.Id);
                            }
                            else
                            {
                                existingQuestion.Options.Add(new QuizOption
                                {
                                    Title = optionDto.Title,
                                    IsCorrect = optionDto.IsCorrect,
                                    DateCreated = DateTime.Now
                                });
                            }
                        }

                        existingQuestion.Options.RemoveAll(o => !updatedOptionIds.Contains(o.Id));
                    }
                    else
                    {
                        QuizQuestion newQuestion = new()
                        {
                            Title = questionDto.Title,
                            DateCreated = DateTime.Now,
                            RandomOptions = questionDto.RandomOptions,
                            Options = questionDto.Options.Select(o => new QuizOption
                            {
                                Title = o.Title,
                                IsCorrect = o.IsCorrect,
                                DateCreated = DateTime.Now
                            }).ToList()
                        };

                        existingQuiz.Questions.Add(newQuestion);
                    }
                }

                existingQuiz.Questions.RemoveAll(q => !updatedQuestionIds.Contains(q.Id) && q.Id != 0);

                await context.SaveChangesAsync();

                return existingQuiz;
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating quiz: " + ex.Message);
            }
        }

        private string GenerateCode()
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();

            string code;
            do
            {
                code = new string(Enumerable.Repeat(chars, 6)
                    .Select(s => s[random.Next(s.Length)]).ToArray());
            } while (context.Quiz.Any(q => q.Code == code));

            return code;
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

        public async Task<QuizResult?> Complete(QuizResultDTO model)
        {
            try
            {
                if (model.QuizId <= 0 || model.UserId <= 0 || model.TotalQuestions <= 0)
                {
                    throw new ArgumentException("Invalid quiz result data.");
                }

                int percentage = (int)Math.Round((double)model.Score * 100 / model.TotalQuestions);
                int duration = (int)(model.EndTime - model.StartTime).TotalSeconds;

                QuizResult result = new()
                {
                    QuizId = model.QuizId,
                    UserId = model.UserId,
                    Score = model.Score,
                    TotalQuestions = model.TotalQuestions,
                    Percentage = percentage,
                    StartTime = model.StartTime,
                    EndTime = model.EndTime,
                    DurationSeconds = duration
                };

                context.QuizResult.Add(result);
                await context.SaveChangesAsync();

                return result;
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception("Error saving quiz result: " + ex.Message);
            }
        }
    }
}
