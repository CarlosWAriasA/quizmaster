using Microsoft.AspNetCore.Mvc;

namespace QuizMaster.Helpers
{
    public class ApiResponse : IActionResult
    {
        private readonly object _content;
        private readonly int _statusCode;

        private ApiResponse(object content, int statusCode)
        {
            _content = content;
            _statusCode = statusCode;
        }

        public static IActionResult Success(object? data = null)
        {
            return new ApiResponse(new
            {
                success = true,
                type = "success",
                data
            }, 200);
        }

        public static IActionResult Error(string message, int statusCode = 400, string type = "error")
        {
            return new ApiResponse(new
            {
                success = false,
                type,
                error = message
            }, statusCode);
        }

        public static IActionResult Exception(Exception ex)
        {
            return ex switch
            {
                ArgumentException => Error(ex.Message, 400, "warning"),
                _ => Error(ex.Message, 500, "error")
            };
        }

        public static IActionResult Exception(ArgumentException ex)
        {
            return Error(ex.Message, 400, "warning");
        }

        public static IActionResult Warning(ArgumentException ex)
        {
            return Error(ex.Message, 400, "warning");
        }

        public async Task ExecuteResultAsync(ActionContext context)
        {
            var objectResult = new ObjectResult(_content)
            {
                StatusCode = _statusCode
            };
            await objectResult.ExecuteResultAsync(context);
        }
    }
}
