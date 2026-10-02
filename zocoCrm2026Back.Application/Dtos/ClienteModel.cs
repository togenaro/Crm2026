using zocoCrm2026Back.Domain.Entities;

namespace zocoCrm2026Back.Application.Dtos;

public record ClienteModel
{
    public record ClienteResponse(
        Guid Id,
        string Nombre,
        string Cuit,
        string? Telefono,
        string? Email,
        EstadoCliente Estado,
        string? Asesor,
        DateTime? ProximoContacto,
        DateTime FechaCreacion,
        DateTime FechaActualizacion
    );
}
