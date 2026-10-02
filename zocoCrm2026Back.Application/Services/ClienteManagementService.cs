using zocoCrm2026Back.Application.Dtos;
using zocoCrm2026Back.Domain.Entities;
using zocoCrm2026Back.Domain.Interfaces;
using System.Text.RegularExpressions;
using zocoCrm2026Back.Application.Exceptions;

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
        ValidateRequest(request.Nombre, request.Cuit, request.Email,
            request.Estado, request.Asesor);
        
        var exist = await _repository.First<Cliente>(
            c => c.Cuit == request.Cuit);

        if (exist != null)
            throw new DuplicatedEntityException(
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

    public async Task<ClienteModel.ClienteResponse> UpdateCliente(
        Guid id,
        ClienteModel.ClienteUpdate update)
    {
        ValidateRequest(update.Nombre, update.Cuit, update.Email,
            update.Estado, update.Asesor);

        var cliente = await _repository.GetById<Cliente>(id);
        if (cliente == null || !cliente.IsActive)
            throw new KeyNotFoundException("Cliente no encontrado.");

        var exist = await _repository.First<Cliente>(
            c => c.Cuit == update.Cuit && c.Id != id);

        if (exist != null)
            throw new DuplicatedEntityException(
                $"Ya existe un cliente con el CUIT {update.Cuit}");

        cliente.Nombre = update.Nombre;
        cliente.Cuit = update.Cuit;
        cliente.Telefono = update.Telefono;
        cliente.Email = update.Email;
        cliente.Estado = update.Estado;
        cliente.Asesor = update.Asesor;
        cliente.FechaActualizacion = DateTime.UtcNow;

        await _repository.Update(cliente);

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
    
    private void ValidateRequest(
        string nombre, string cuit, string? email,
        EstadoCliente estado, string? asesor)
    {
        var errores = new List<string>();

        if (string.IsNullOrWhiteSpace(nombre) || nombre.Length < 3 || nombre.Length > 100)
            errores.Add("El nombre es obligatorio y debe tener entre 3 y 100 caracteres.");

        if (string.IsNullOrWhiteSpace(cuit))
            errores.Add("El CUIT es obligatorio.");

        if (!Regex.IsMatch(cuit, @"^\d{2}-\d{8}-\d{1}$"))
            errores.Add("El CUIT debe tener formato XX-XXXXXXXX-X.");

        if (!Enum.IsDefined(typeof(EstadoCliente), estado))
            errores.Add("Estado de cliente no válido.");

        if (!string.IsNullOrWhiteSpace(email) &&
            !Regex.IsMatch(email, @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"))
            errores.Add("Formato de email no válido.");

        if (string.IsNullOrWhiteSpace(asesor) || asesor.Length < 2 || asesor.Length > 100)
            errores.Add("El asesor es obligatorio y debe tener entre 2 y 100 caracteres.");

        if (errores.Any())
            throw new ValidationException(errores);
    }
}
