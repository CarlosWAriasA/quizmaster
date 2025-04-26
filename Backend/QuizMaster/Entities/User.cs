namespace QuizMaster.Entities
{
    public class User
    {
        public int Id { get; set; }
        public required string UserName { get; set; }
        public string? Email { get; set; }
        public required string PasswordHash { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpireIn { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? LastUpdate { get; set; }
    }
}

