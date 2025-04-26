using Microsoft.EntityFrameworkCore;
using QuizMaster.Entities;

namespace QuizMaster.Data
{
    public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Quiz> Quiz { get; set; }
        public DbSet<QuizQuestion> QuizQuestion { get; set; }
        public DbSet<QuizOption> QuizOption { get; set; }
    }
}
