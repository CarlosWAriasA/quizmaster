﻿namespace QuizMaster.Models
{
    public class TokenResponseDTO
    {
        public int? UserId { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
    }
}
