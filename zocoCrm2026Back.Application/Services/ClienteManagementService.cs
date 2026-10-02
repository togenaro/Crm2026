using zocoCrm2026Back.Application.Dtos;
using zocoCrm2026Back.Domain.Entities;
using zocoCrm2026Back.Domain.Interfaces;

namespace zocoCrm2026Back.Application.Services;

public class ClienteManagementService
{
    private readonly IRepository _repository;

    public ClienteManagementService(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<PagedResponse<ClienteModel.ClienteResponse>> GetClients(
        string? search,
        EstadoCliente? estado,
        string? asesor = null,
        int page = 1,
        int pageSize = 5)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 5;

        var query = _repository.Query<Cliente>()
            .Where(c => c.IsActive);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var lowerSearch = search.Trim().ToLower();
            query = query.Where(c =>
                (c.Nombre != null && c.Nombre.ToLower().Contains(lowerSearch)) ||
                (c.Cuit != null && c.Cuit.ToLower().Contains(lowerSearch)) ||
                (c.Telefono != null && c.Telefono.ToLower().Contains(lowerSearch)));
        }

        if (estado.HasValue)
            query = query.Where(c => c.Estado == estado.Value);

        if (!string.IsNullOrWhiteSpace(asesor))
        {
            var lowerAsesor = asesor.Trim().ToLower();
            query = query.Where(c =>
                c.Asesor != null && c.Asesor.ToLower().Contains(lowerAsesor));
        }

        var totalItems = query.Count();
        var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

        var items = query
            .OrderBy(c => c.ProximoContacto ?? DateTime.MaxValue)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new ClienteModel.ClienteResponse(
                c.Id,
                c.Nombre!,
                c.Cuit!,
                c.Telefono,
                c.Email,
                c.Estado,
                c.Asesor,
                c.ProximoContacto,
                c.FechaCreacion,
                c.FechaActualizacion))
            .ToList();

        return await Task.FromResult(new PagedResponse<ClienteModel.ClienteResponse>(
            items,
            totalItems,
            page,
            pageSize,
            totalPages));
    }
    
    public async Task<ClienteModel.ClienteResponse> GetClienteById(Guid id)
    {
        var cliente = await _repository.GetById<Cliente>(id);

        if (cliente == null || !cliente.IsActive)
            throw new KeyNotFoundException("Cliente no encontrado.");

        return new ClienteModel.ClienteResponse(
            cliente.Id,
            cliente.Nombre!,
            cliente.Cuit!,
            cliente.Telefono,
            cliente.Email,
            cliente.Estado,
            cliente.Asesor,
            cliente.ProximoContacto,
            cliente.FechaCreacion,
            cliente.FechaActualizacion);
    }
    
    public async Task<ClienteModel.ClienteResponse> AddCliente(
        ClienteModel.ClienteRequest request)
    {
        var exist = await _repository.First<Cliente>(
            c => c.Cuit == request.Cuit);

        if (exist != null)
            throw new InvalidOperationException(
                $"Ya existe un cliente con el CUIT {request.Cuit}");

        var cliente = new Cliente
        {
            Nombre = request.Nombre,
            Cuit = request.Cuit,
            Telefono = request.Telefono,
            Email = request.Email,
            Estado = request.Estado,
            Asesor = request.Asesor,
            IsActive = true
        };

        await _repository.Add(cliente);

        return new ClienteModel.ClienteResponse(
            cliente.Id,
            cliente.Nombre!,
            cliente.Cuit!,
            cliente.Telefono,
            cliente.Email,
            cliente.Estado,
            cliente.Asesor,
            cliente.ProximoContacto,
            cliente.FechaCreacion,
            cliente.FechaActualizacion);
    }
}