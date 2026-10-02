using zocoCrm2026Back.Application.Dtos;
using zocoCrm2026Back.Domain.Entities;
using zocoCrm2026Back.Domain.Interfaces;

namespace zocoCrm2026Back.Application.Services;

public class DashboardService
{
    private readonly IRepository _repository;

    public DashboardService(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<DashboardModel.ResumenResponse> GetResumen()
    {
        var clientes = await _repository.GetAll<Cliente>();
        var activos = clientes?.Where(cliente => cliente.IsActive).ToList()
                      ?? new List<Cliente>();

        if (!activos.Any())
            return new DashboardModel.ResumenResponse(0, 0, 0, 0);

        var ahora = DateTime.UtcNow;

        return new DashboardModel.ResumenResponse(
            TotalClientes: activos.Count,
            CantidadProspectos: activos.Count(cliente => cliente.Estado == EstadoCliente.Prospecto),
            CantidadInteresados: activos.Count(cliente => cliente.Estado == EstadoCliente.Interesado),
            SeguimientosVencidos: activos.Count(cliente =>
                cliente.ProximoContacto.HasValue && cliente.ProximoContacto.Value < ahora));
    }
}
