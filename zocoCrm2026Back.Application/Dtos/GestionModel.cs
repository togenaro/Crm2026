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
}
