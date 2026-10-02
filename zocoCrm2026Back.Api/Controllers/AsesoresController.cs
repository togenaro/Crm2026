using Microsoft.AspNetCore.Mvc;
using zocoCrm2026Back.Application.Dtos;
using zocoCrm2026Back.Application.Services;

namespace zocoCrm2026Back.Api.Controllers;

[ApiController]
[Route("api/asesores")]
public class AsesoresController : ControllerBase
{
    private readonly AsesorManagementService _asesorService;

    public AsesoresController(AsesorManagementService asesorService)
    {
        _asesorService = asesorService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAsesores()
    {
        var asesores = await _asesorService.GetAsesores();
        return Ok(asesores);
    }

    [HttpPost]
    public async Task<IActionResult> AddAsesor([FromBody] AsesorModel.AsesorRequest request)
    {
        var asesor = await _asesorService.AddAsesor(request);
        return Created($"api/asesores/{asesor.Id}", asesor);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AsesorModel.LoginRequest request)
    {
        var asesor = await _asesorService.Login(request);
        if (asesor == null)
            return Unauthorized(new { error = "Usuario o contraseña incorrectos." });

        return Ok(asesor);
    }
}
