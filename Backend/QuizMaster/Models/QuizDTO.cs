using QuizMaster.Entities;

namespace QuizMaster.Models
{
    public class QuizDTO
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public string? Code { get; set; }
        public int UserId { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? LastUpdate { get; set; }
        public User? User { get; set; }
        public List<QuizQuestionDTO> Questions { get; set; } = [];

        public class QuizQuestionDTO
        {
            public int Id { get; set; }
            public required string Title { get; set; }
            public int QuizId { get; set; }
            public Quiz? Quiz { get; set; }
            public List<QuizOptionDTO> Options { get; set; } = [];
        }

        public class QuizOptionDTO
        {
            public int Id { get; set; }
            public required string Title { get; set; }
            public bool IsCorrect { get; set; }
            public int QuestionId { get; set; }
            public QuizQuestion? Question { get; set; }
        }
    }
}
