using Microsoft.Extensions.DependencyInjection;
using zocoCrm2026Back.Data.Repositories;
using zocoCrm2026Back.Domain.Interfaces;

namespace zocoCrm2026Back.Data;

public static class DependencyInjection
{
    public static IServiceCollection AddPersistence(this IServiceCollection services)
    {
        services.AddSingleton<IRepository, InMemoryRepository>();
        return services;
    }
}
