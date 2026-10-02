namespace zocoCrm2026Back.Application.Dtos;

public record AsesorModel
{
    public record AsesorResponse(Guid Id, string Usuario, string Nombre);

    public record AsesorRequest(string Usuario, string Nombre, string Password);

    public record LoginRequest(string Usuario, string Password);
}
