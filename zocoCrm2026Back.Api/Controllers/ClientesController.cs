using zocoCrm2026Back.Application.Services;
using zocoCrm2026Back.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace zocoCrm2026Back.Api.Controllers;

[ApiController]
[Route("api/clientes")]
public class ClientesController : ControllerBase
{
    private readonly ClienteManagementService _clienteService;

    public ClientesController(ClienteManagementService clienteService)
    {
        _clienteService = clienteService;
    }

    [HttpGet]
    public async Task<IActionResult> GetClients(
        [FromQuery] string? search,
        [FromQuery] EstadoCliente? estado,
        [FromQuery] string? asesor,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5)
    {
        var result = await _clienteService.GetClients(
            search, estado, asesor, page, pageSize);

        return Ok(result);
    }
}