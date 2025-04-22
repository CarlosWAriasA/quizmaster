using Microsoft.AspNetCore.Identity;

namespace QuizMaster.Entities
{
    public class Note
    {
        public int Id { get; set; }
        public required string Description { get; set; }
        public DateTime DateCreated { get; set; }
        public required int UserId { get; set; }
        public User? User { get; set; }
    }
}
