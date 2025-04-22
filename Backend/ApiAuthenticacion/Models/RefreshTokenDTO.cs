namespace QuizMaster.Models
{
    public class RefreshTokenDTO
    {
        public int UserId { get; set; }
        public string? RefreshToken { get; set; }
    }
}
