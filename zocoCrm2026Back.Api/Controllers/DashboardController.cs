using Microsoft.AspNetCore.Mvc;
using zocoCrm2026Back.Application.Services;

namespace zocoCrm2026Back.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _dashboardService;

    public DashboardController(DashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("resumen")]
    public async Task<IActionResult> GetResumen()
    {
        var resumen = await _dashboardService.GetResumen();
        return Ok(resumen);
    }
}
