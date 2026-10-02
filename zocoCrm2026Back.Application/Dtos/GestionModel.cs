using zocoCrm2026Back.Domain.Entities;

namespace zocoCrm2026Back.Application.Dtos;

public record GestionModel
{
    public record GestionRequest(
        string? TipoContacto,
        string? Comentario,
        string? EstadoResultante,
        DateTime? FechaGestion = null,
        DateTime? ProximoContacto = null,
        string? Asesor = null
    );

    public record GestionUpdate(
        string? TipoContacto,
        string? Comentario,
        string? EstadoResultante,
        DateTime? ProximoContacto,
        DateTime FechaGestion
    );

    public record GestionResponse(
        Guid Id,
        Guid ClienteId,
        TipoContacto TipoContacto,
        string? Comentario,
        EstadoCliente EstadoResultante,
        DateTime FechaGestion,
        DateTime? ProximoContacto,
        string? Asesor
    );

    public record GestionGeneralResponse(
        Guid Id,
        Guid ClienteId,
        string? ClienteNombre,
        string? ClienteCuit,
        TipoContacto TipoContacto,
        string? Comentario,
        EstadoCliente EstadoResultante,
        DateTime FechaGestion,
        DateTime? ProximoContacto,
        string? Asesor
    );

    public record GestionGeneralPagedResponse(
        List<GestionGeneralResponse> Items,
        int TotalItems,
        int Page,
        int PageSize,
        int TotalPages,
        List<string> Asesores
    );
}
