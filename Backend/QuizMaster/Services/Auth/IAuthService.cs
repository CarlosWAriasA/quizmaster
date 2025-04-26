using QuizMaster.Models;
using QuizMaster.Entities;

namespace QuizMaster.Services.Auth
{
    public interface IAuthService
    {
        Task<User?> Register(UserDTO model);
        Task<TokenResponseDTO?> Login(UserDTO model);
        Task<TokenResponseDTO?> RefreshToken(RefreshTokenDTO model);
    }
}
