using System.Text.Json;
using System.Text.Json.Serialization;
using zocoCrm2026Back.Domain.Entities;

namespace zocoCrm2026Back.Data.Helpers;

public static class DbContextExtensions
{
    public static void Seedwork<T>(this ZocoCrmContext context, string dataSource)
        where T : EntityBase
    {
        var path = Path.Combine(AppContext.BaseDirectory, dataSource);
        var json = File.ReadAllText(path);
        var entities = JsonSerializer.Deserialize<List<T>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter(null, allowIntegerValues: false) }
        });

        if (entities is null || entities.Count == 0)
            return;

        var existingIds = context.Set<T>()
            .Select(entity => entity.Id)
            .ToHashSet();
        var missingEntities = entities
            .Where(entity => !existingIds.Contains(entity.Id))
            .ToList();

        if (missingEntities.Count == 0)
            return;

        context.Set<T>().AddRange(missingEntities);
        context.SaveChanges();
    }
}
