using zocoCrm2026Back.Application.Dtos;
using zocoCrm2026Back.Domain.Entities;
using zocoCrm2026Back.Domain.Interfaces;

namespace zocoCrm2026Back.Application.Services;

public class GestionManagementService
{
    private readonly IRepository _repository;

    public GestionManagementService(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<PagedResponse<GestionModel.GestionResponse>> GetGestiones(
        Guid clienteId,
        int page = 1,
        int pageSize = 5)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 5;

        var cliente = await _repository.GetById<Cliente>(clienteId);
        if (cliente == null || !cliente.IsActive)
        {
            return new PagedResponse<GestionModel.GestionResponse>(
                new List<GestionModel.GestionResponse>(),
                0,
                page,
                pageSize,
                0);
        }

        var gestiones = await _repository.GetFiltered<Gestion>(
            gestion => gestion.ClienteId == clienteId) ?? new List<Gestion>();

        var totalItems = gestiones.Count();
        var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

        var items = gestiones
            .OrderByDescending(gestion => gestion.FechaGestion)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(gestion => new GestionModel.GestionResponse(
                gestion.Id,
                gestion.ClienteId,
                gestion.TipoContacto,
                gestion.Comentario,
                gestion.EstadoResultante,
                gestion.FechaGestion,
                gestion.ProximoContacto,
                gestion.Asesor ?? cliente.Asesor ?? "Asesor Asignado"))
            .ToList();

        return new PagedResponse<GestionModel.GestionResponse>(
            items,
            totalItems,
            page,
            pageSize,
            totalPages);
    }
}
