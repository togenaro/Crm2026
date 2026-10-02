using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using zocoCrm2026Back.Data.Repositories;
using zocoCrm2026Back.Domain.Interfaces;

namespace zocoCrm2026Back.Data;

public static class DependencyInjection
{
    public static IServiceCollection AddPersistence(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<ZocoCrmContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                sqlServer => sqlServer.MigrationsAssembly("zocoCrm2026Back.Api")));

        services.AddScoped<IRepository, EfRepository>();
        return services;
    }
}
