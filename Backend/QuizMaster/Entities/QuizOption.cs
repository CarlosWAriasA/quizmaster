namespace QuizMaster.Entities
{
    public class QuizOption
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public bool IsCorrect { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? LastUpdate { get; set; }
        public int QuestionId { get; set; }
        public QuizQuestion? Question { get; set; }
    }
}
