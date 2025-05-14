namespace QuizMaster.Entities
{
    public class QuizQuestion
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? LastUpdate { get; set; }
        public bool? RandomOptions { get; set; }
        public int QuizId { get; set; }
        public Quiz? Quiz { get; set; }
        public List<QuizOption> Options { get; set; } = [];
    }
}
