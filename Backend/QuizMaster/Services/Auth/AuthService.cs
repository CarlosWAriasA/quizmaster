using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using QuizMaster.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QuizMaster.Data;
using QuizMaster.Entities;

namespace QuizMaster.Services.Auth
{
    public class AuthService(DataContext context, IConfiguration configuration) : IAuthService
    {
        public async Task<TokenResponseDTO?> Login(UserDTO model)
        {
            if (string.IsNullOrWhiteSpace(model.Email) || !model.Email.Contains('@'))
            {
                throw new ArgumentException("Invalid email address");
            }

            if (string.IsNullOrWhiteSpace(model.Password) || model.Password.Length < 6)
            {
                throw new ArgumentException("Password must be at least 6 characters long");
            }

            User? user = await context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user is null)
            {
                throw new ArgumentException("Incorrect email or password");
            }

            bool validPassword = new PasswordHasher<User>()
                .VerifyHashedPassword(user, user.PasswordHash, model.Password) == PasswordVerificationResult.Success;

            if (!validPassword)
            {
                throw new ArgumentException("Incorrect email or password");
            }

            return await CreateTokenResponse(user);
        }

        public async Task<User?> Register(UserDTO model)
        {
            if (string.IsNullOrWhiteSpace(model.UserName) || model.UserName.Length < 6)
            {
                throw new ArgumentException("Name must be at least 6 characters long");
            }

            if (string.IsNullOrWhiteSpace(model.Email) || !model.Email.Contains('@'))
            {
                throw new ArgumentException("Invalid email address");
            }

            if (string.IsNullOrWhiteSpace(model.Password) || model.Password.Length < 6)
            {
                throw new ArgumentException("Password must be at least 6 characters long");
            }

            if (await context.Users.AnyAsync(u => u.Email == model.Email))
            {
                throw new ArgumentException("Email is already registered");
            }

            if (await context.Users.AnyAsync(u => u.UserName == model.UserName))
            {
                throw new ArgumentException("Username is already taken");
            }

            User newUser = new()
            {
                UserName = model.UserName,
                Email = model.Email,
                DateCreated = DateTime.Now,
                PasswordHash = model.Password
            };

            string hashedPassword = new PasswordHasher<User>().HashPassword(newUser, model.Password);
            newUser.PasswordHash = hashedPassword;

            context.Users.Add(newUser);
            await context.SaveChangesAsync();

            return newUser;
        }

        public async Task<TokenResponseDTO?> RefreshToken(RefreshTokenDTO model)
        {
            if (string.IsNullOrWhiteSpace(model.RefreshToken)) return null;

            User? user = await ValidateRefreshToken(model.UserId, model.RefreshToken);

            if (user is null)
            {
                return null;
            }

            return await CreateTokenResponse(user);
        }

        private async Task<TokenResponseDTO> CreateTokenResponse(User user)
        {
            string token = CreateToken(user);
            string refreshToken = await SaveRefreshToken(user);
            TokenResponseDTO response = new() { AccessToken = token, RefreshToken = refreshToken, UserId = user.Id };

            return response;
        }

        private async Task<User?> ValidateRefreshToken(int userId, string refreshToken)
        {
            User? user = await context.Users.FindAsync(userId);

            if (user is null || refreshToken is null || user.RefreshToken != refreshToken || user.RefreshTokenExpireIn <= DateTime.Now)
            {
                return null;
            }

            return user;
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task<string> SaveRefreshToken(User user)
        {
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpireIn = DateTime.Now.AddDays(1);
            await context.SaveChangesAsync();
            return refreshToken;
        }

        private string CreateToken(User user)
        {
            List<Claim> claims =
            [
                new(ClaimTypes.Name, user.UserName),
                new (ClaimTypes.NameIdentifier, user.Id.ToString())
            ];

            SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(configuration.GetValue<string>("AppSettings:Token") ?? ""));

            SigningCredentials credentials = new(key, SecurityAlgorithms.HmacSha512);

            JwtSecurityToken tokenDescriptor = new(
                issuer: configuration.GetValue<string>("AppSettings:Issuer"),
                audience: configuration.GetValue<string>("AppSettings:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }

    }
}
