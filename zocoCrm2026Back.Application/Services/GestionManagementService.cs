using zocoCrm2026Back.Application.Dtos;
using zocoCrm2026Back.Application.Exceptions;
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

    public async Task<GestionModel.GestionResponse> AddGestion(
        Guid clienteId,
        GestionModel.GestionRequest request)
    {
        var cliente = await _repository.GetById<Cliente>(clienteId);
        if (cliente == null || !cliente.IsActive)
            throw new KeyNotFoundException("Cliente no encontrado.");

        var errores = new List<string>();

        var tipoClean = request.TipoContacto?.Replace("ó", "o");
        if (!Enum.TryParse<TipoContacto>(tipoClean, out var tipoContacto))
            errores.Add("Tipo de contacto no válido. Valores permitidos: Llamada, WhatsApp, Correo, Reunión, Otro.");

        if (!Enum.TryParse<EstadoCliente>(request.EstadoResultante, out var estadoResultante))
            errores.Add("Estado resultante no válido. Valores permitidos: Prospecto, Contactado, Interesado, NoInteresado, Cliente.");

        if (string.IsNullOrWhiteSpace(request.Comentario) || request.Comentario.Length < 5)
            errores.Add("El comentario es obligatorio y debe tener al menos 5 caracteres.");

        if (request.ProximoContacto.HasValue && request.ProximoContacto.Value < DateTime.UtcNow.Date)
            errores.Add("El próximo contacto no puede ser una fecha pasada.");

        if (errores.Any())
            throw new ValidationException(errores);

        var gestion = new Gestion
        {
            ClienteId = clienteId,
            TipoContacto = tipoContacto,
            Comentario = request.Comentario,
            EstadoResultante = estadoResultante,
            FechaGestion = request.FechaGestion ?? DateTime.UtcNow,
            ProximoContacto = request.ProximoContacto,
            Asesor = request.Asesor ?? cliente.Asesor
        };

        await _repository.Add(gestion);

        cliente.Estado = estadoResultante;
        if (request.ProximoContacto.HasValue)
            cliente.ProximoContacto = request.ProximoContacto;
        cliente.FechaActualizacion = DateTime.UtcNow;
        await _repository.Update(cliente);

        return new GestionModel.GestionResponse(
            gestion.Id,
            gestion.ClienteId,
            gestion.TipoContacto,
            gestion.Comentario,
            gestion.EstadoResultante,
            gestion.FechaGestion,
            gestion.ProximoContacto,
            gestion.Asesor);
    }

    public async Task<GestionModel.GestionResponse> UpdateGestion(
        Guid clienteId,
        Guid gestionId,
        GestionModel.GestionUpdate request)
    {
        var cliente = await _repository.GetById<Cliente>(clienteId);
        if (cliente == null || !cliente.IsActive)
            throw new KeyNotFoundException("Cliente no encontrado.");

        var gestion = await _repository.First<Gestion>(
            item => item.Id == gestionId && item.ClienteId == clienteId);
        if (gestion == null)
            throw new KeyNotFoundException("Gestión no encontrada.");

        var errores = new List<string>();

        var tipoClean = request.TipoContacto?.Replace("ó", "o");
        if (!Enum.TryParse<TipoContacto>(tipoClean, out var tipoContacto))
            errores.Add("Tipo de contacto no válido. Valores permitidos: Llamada, WhatsApp, Correo, Reunión, Otro.");

        if (!Enum.TryParse<EstadoCliente>(request.EstadoResultante, out var estadoResultante))
            errores.Add("Estado resultante no válido. Valores permitidos: Prospecto, Contactado, Interesado, NoInteresado, Cliente.");

        if (string.IsNullOrWhiteSpace(request.Comentario) || request.Comentario.Length < 5)
            errores.Add("El comentario es obligatorio y debe tener al menos 5 caracteres.");

        if (request.ProximoContacto.HasValue
            && request.ProximoContacto.Value < DateTime.UtcNow.Date
            && request.ProximoContacto.Value.Date != gestion.ProximoContacto?.Date)
            errores.Add("El próximo contacto no puede ser una fecha pasada.");

        if (errores.Any())
            throw new ValidationException(errores);

        gestion.TipoContacto = tipoContacto;
        gestion.Comentario = request.Comentario;
        gestion.EstadoResultante = estadoResultante;
        gestion.ProximoContacto = request.ProximoContacto;
        gestion.FechaGestion = request.FechaGestion;

        await _repository.Update(gestion);

        var gestionesCliente = await _repository.GetFiltered<Gestion>(
            item => item.ClienteId == clienteId);
        var gestionMasReciente = gestionesCliente?
            .OrderByDescending(item => item.FechaGestion)
            .FirstOrDefault();

        if (gestionMasReciente != null)
        {
            cliente.Estado = gestionMasReciente.EstadoResultante;
            cliente.ProximoContacto = gestionMasReciente.ProximoContacto;
            cliente.FechaActualizacion = DateTime.UtcNow;
            await _repository.Update(cliente);
        }

        return new GestionModel.GestionResponse(
            gestion.Id,
            gestion.ClienteId,
            gestion.TipoContacto,
            gestion.Comentario,
            gestion.EstadoResultante,
            gestion.FechaGestion,
            gestion.ProximoContacto,
            gestion.Asesor);
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
