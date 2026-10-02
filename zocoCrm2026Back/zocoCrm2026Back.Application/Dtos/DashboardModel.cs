namespace zocoCrm2026Back.Application.Dtos;

public record DashboardModel
{
    public record ResumenResponse(
        int TotalClientes,
        int CantidadProspectos,
        int CantidadInteresados,
        int SeguimientosVencidos
    );
}
