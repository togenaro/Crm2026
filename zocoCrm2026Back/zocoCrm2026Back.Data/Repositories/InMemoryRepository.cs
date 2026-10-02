using zocoCrm2026Back.Domain.Entities;
using zocoCrm2026Back.Domain.Interfaces;
using System.Linq.Expressions;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace zocoCrm2026Back.Data.Repositories;

public class InMemoryRepository : IRepository
{
    private readonly Dictionary<Type, List<EntityBase>> _store;

    public InMemoryRepository()
    {
        _store = new Dictionary<Type, List<EntityBase>>();
        LoadClientes();
        LoadGestiones();
    }

    private List<T> GetList<T>() where T : EntityBase
    {
        if (_store.TryGetValue(typeof(T), out var list))
            return list.Cast<T>().ToList();
        return new List<T>();
    }

    private void SetList<T>(List<T> list) where T : EntityBase
    {
        _store[typeof(T)] = list.Cast<EntityBase>().ToList();
    }

    public async Task<T?> GetById<T>(Guid id, params string[] include) where T : EntityBase
    {
        return await Task.FromResult(GetList<T>().FirstOrDefault(e => e.Id == id));
    }

    public async Task<IEnumerable<T>?> GetAll<T>(params string[] include) where T : EntityBase
    {
        return await Task.FromResult(GetList<T>());
    }

    public async Task<T?> First<T>(Expression<Func<T, bool>> predicate, params string[] include) where T : EntityBase
    {
        return await Task.FromResult(GetList<T>().FirstOrDefault(predicate.Compile()));
    }

    public async Task<IEnumerable<T>?> GetFiltered<T>(Expression<Func<T, bool>> predicate, params string[] include) where T : EntityBase
    {
        return await Task.FromResult(GetList<T>().Where(predicate.Compile()));
    }

    public async Task<T> Add<T>(T entity) where T : EntityBase
    {
        var list = GetList<T>();
        list.Add(entity);
        SetList(list);
        return await Task.FromResult(entity);
    }

    public async Task<T> Update<T>(T entity) where T : EntityBase
    {
        var list = GetList<T>();
        var index = list.FindIndex(e => e.Id == entity.Id);
        if (index >= 0)
        {
            list[index] = entity;
            SetList(list);
        }
        return await Task.FromResult(entity);
    }

    public async Task<T> Delete<T>(T entity) where T : EntityBase
    {
        var list = GetList<T>();
        list.RemoveAll(e => e.Id == entity.Id);
        SetList(list);
        return await Task.FromResult(entity);
    }

    public IQueryable<T> Query<T>() where T : EntityBase
    {
        return GetList<T>().AsQueryable();
    }

    private void LoadClientes()
    {
        var path = Path.Combine(AppContext.BaseDirectory, "Sources", "clientes.json");
        var json = File.ReadAllText(path);
        var clientes = JsonSerializer.Deserialize<List<Cliente>>(json, CreateJsonOptions());
        _store[typeof(Cliente)] = clientes?.Cast<EntityBase>().ToList() ?? new List<EntityBase>();
    }

    private void LoadGestiones()
    {
        var path = Path.Combine(AppContext.BaseDirectory, "Sources", "gestiones.json");
        var json = File.ReadAllText(path);
        var gestiones = JsonSerializer.Deserialize<List<Gestion>>(json, CreateJsonOptions());
        _store[typeof(Gestion)] = gestiones?.Cast<EntityBase>().ToList() ?? new List<EntityBase>();
    }

    private static JsonSerializerOptions CreateJsonOptions()
    {
        return new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter(null, allowIntegerValues: false) }
        };
    }
}
