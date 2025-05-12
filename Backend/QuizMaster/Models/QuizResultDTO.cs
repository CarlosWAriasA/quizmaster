namespace QuizMaster.Models
{
    public class QuizResultDTO
    {
        public int Id { get; set; }
        public int Percentage { get; set; }
        public int DurationSeconds { get; set; }
        public int UserId { get; set; }
        public int QuizId { get; set; }
        public int Score { get; set; }
        public int TotalQuestions { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public QuizDTO? Quiz { get; set; }
    }
}
