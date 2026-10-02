using zocoCrm2026Back.Domain.Entities;

namespace zocoCrm2026Back.Application.Dtos;

public record GestionModel
{
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
