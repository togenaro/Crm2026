using Microsoft.AspNetCore.Mvc;
using zocoCrm2026Back.Application.Services;

namespace zocoCrm2026Back.Api.Controllers;

[ApiController]
[Route("api/gestiones")]
public class GestionesController : ControllerBase
{
    private readonly GestionManagementService _gestionService;

    public GestionesController(GestionManagementService gestionService)
    {
        _gestionService = gestionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetGestiones(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5,
        [FromQuery] string? search = null,
        [FromQuery] string? tipo = null,
        [FromQuery] string? asesor = null)
    {
        var result = await _gestionService.GetGestiones(
            page,
            pageSize,
            search,
            tipo,
            asesor);

        return Ok(result);
    }
}
