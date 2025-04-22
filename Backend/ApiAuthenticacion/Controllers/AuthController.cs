using System.Security.Claims;
using QuizMaster.Models;
using QuizMaster.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizMaster.Entities;

namespace QuizMaster.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDTO model)
        {
            try
            {
                User? user = await authService.Register(model);
                return Ok(user);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserDTO model)
        {
            try
            {
                TokenResponseDTO? token = await authService.Login(model);
                return Ok(token);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
        }


        [HttpPost("refreshToken")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDTO model)
        {
            TokenResponseDTO? token = await authService.RefreshToken(model);

            if (token is null || token.AccessToken is null || token.RefreshToken is null)
            {
                return BadRequest("Invalid Refresh Token");
            }

            return Ok(token);
        }

        [HttpGet("validateToken")]
        [Authorize]
        public IActionResult ValidateToken()
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Ok(new { valid = true, userId });
        }
    }
}
