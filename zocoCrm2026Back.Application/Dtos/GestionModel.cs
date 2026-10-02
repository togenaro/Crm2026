using zocoCrm2026Back.Domain.Entities;

namespace zocoCrm2026Back.Application.Dtos;

public record GestionModel
{
    public record GestionRequest(
        TipoContacto TipoContacto,
        string? Comentario,
        EstadoCliente EstadoResultante,
        DateTime? FechaGestion = null,
        DateTime? ProximoContacto = null,
        string? Asesor = null
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
