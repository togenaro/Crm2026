using System.Text.Json;
using System.Text.Json.Serialization;
using zocoCrm2026Back.Domain.Entities;

namespace zocoCrm2026Back.Data.Helpers;

public static class DbContextExtensions
{
    public static void Seedwork<T>(this ZocoCrmContext context, string dataSource)
        where T : class
    {
        if (context.Set<T>().Any())
            return;

        var path = Path.Combine(AppContext.BaseDirectory, dataSource);
        var json = File.ReadAllText(path);
        var entities = JsonSerializer.Deserialize<List<T>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter(null, allowIntegerValues: false) }
        });

        if (entities is null || entities.Count == 0)
            return;

        context.Set<T>().AddRange(entities);
        context.SaveChanges();
    }
}
