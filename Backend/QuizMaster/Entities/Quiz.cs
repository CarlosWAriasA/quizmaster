namespace QuizMaster.Entities
{
    public class Quiz
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? LastUpdate { get; set; }
        public required int UserId { get; set; }
        public User? User { get; set; }
        public List<QuizQuestion> Questions { get; set; } = [];
    }
}
