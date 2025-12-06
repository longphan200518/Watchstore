using Microsoft.AspNetCore.Mvc;

namespace WatchStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new 
            { 
                status = "Healthy",
                message = "WatchStore API is running!",
                timestamp = DateTime.UtcNow
            });
        }
    }
}
