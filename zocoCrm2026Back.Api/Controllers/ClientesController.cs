using zocoCrm2026Back.Application.Services;
using zocoCrm2026Back.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using zocoCrm2026Back.Application.Dtos;

namespace zocoCrm2026Back.Api.Controllers;

[ApiController]
[Route("api/clientes")]
public class ClientesController : ControllerBase
{
    private readonly ClienteManagementService _clienteService;
    private readonly GestionManagementService _gestionService;

    public ClientesController(
        ClienteManagementService clienteService,
        GestionManagementService gestionService)
    {
        _clienteService = clienteService;
        _gestionService = gestionService;
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
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetClienteById(Guid id)
    {
        var cliente = await _clienteService.GetClienteById(id);
        return Ok(cliente);
    }
    
    
    [HttpPost]
    public async Task<IActionResult> AddCliente(
        [FromBody] ClienteModel.ClienteRequest request)
    {
        var cliente = await _clienteService.AddCliente(request);
        return Created($"api/clientes/{cliente.Id}", cliente);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCliente(
        Guid id,
        [FromBody] ClienteModel.ClienteUpdate request)
    {
        var cliente = await _clienteService.UpdateCliente(id, request);
        return Ok(cliente);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCliente(Guid id)
    {
        await _clienteService.DeactivateCliente(id);
        return NoContent();
    }

    [HttpGet("{id}/gestiones")]
    public async Task<IActionResult> GetGestiones(
        Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5)
    {
        var result = await _gestionService.GetGestiones(id, page, pageSize);
        return Ok(result);
    }

    [HttpPost("{id}/gestiones")]
    public async Task<IActionResult> AddGestion(
        Guid id,
        [FromBody] GestionModel.GestionRequest request)
    {
        var gestion = await _gestionService.AddGestion(id, request);
        return Created($"api/clientes/{id}/gestiones/{gestion.Id}", gestion);
    }
}
