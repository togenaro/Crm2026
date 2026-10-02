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
        
        _store = new Dictionary<Type, List<EntityBase>>
        {
            [typeof(Cliente)] = new List<EntityBase>
            {
                new Cliente
                {
                    Id = Guid.Parse("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
                    Nombre = "Juan Pérez",
                    Cuit = "20-12345678-9",
                    Telefono = "381-555-0101",
                    Email = "juan.perez@email.com",
                    Estado = EstadoCliente.Interesado,
                    Asesor = "María González",
                    ProximoContacto = new DateTime(2026, 9, 25, 10, 0, 0, DateTimeKind.Utc),
                    FechaCreacion = new DateTime(2026, 9, 1, 8, 0, 0, DateTimeKind.Utc),
                    FechaActualizacion = new DateTime(2026, 9, 20, 15, 30, 0, DateTimeKind.Utc)
                }
            },
            [typeof(Gestion)] = new List<EntityBase>
            {
                new Gestion
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    ClienteId = Guid.Parse("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
                    TipoContacto = TipoContacto.Llamada,
                    Comentario = "Llamada inicial, mostró interés en el producto",
                    EstadoResultante = EstadoCliente.Contactado,
                    FechaGestion = new DateTime(2026, 9, 1, 8, 30, 0, DateTimeKind.Utc),
                    ProximoContacto = new DateTime(2026, 10, 5, 10, 0, 0, DateTimeKind.Utc),
                    Asesor = "María González"
                },
                new Gestion
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    ClienteId = Guid.Parse("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
                    TipoContacto = TipoContacto.WhatsApp,
                    Comentario = "WhatsApp con detalles de precios y condiciones",
                    EstadoResultante = EstadoCliente.Interesado,
                    FechaGestion = new DateTime(2026, 9, 15, 14, 0, 0, DateTimeKind.Utc),
                    ProximoContacto = new DateTime(2026, 10, 8, 10, 0, 0, DateTimeKind.Utc),
                    Asesor = "María González"
                },
                new Gestion
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    ClienteId = Guid.Parse("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
                    TipoContacto = TipoContacto.Reunion,
                    Comentario = "Reunión presencial para presentar el servicio",
                    EstadoResultante = EstadoCliente.Interesado,
                    FechaGestion = new DateTime(2026, 9, 20, 15, 30, 0, DateTimeKind.Utc),
                    ProximoContacto = new DateTime(2026, 10, 12, 10, 0, 0, DateTimeKind.Utc),
                    Asesor = "María González"
                },
                new Gestion
                {
                    Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    ClienteId = Guid.Parse("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
                    TipoContacto = TipoContacto.Correo,
                    Comentario = "Envío de propuesta comercial por correo",
                    EstadoResultante = EstadoCliente.Interesado,
                    FechaGestion = new DateTime(2026, 9, 22, 9, 0, 0, DateTimeKind.Utc),
                    ProximoContacto = new DateTime(2026, 10, 15, 10, 0, 0, DateTimeKind.Utc),
                    Asesor = "Carlos Ruiz"
                },
                new Gestion
                {
                    Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                    ClienteId = Guid.Parse("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
                    TipoContacto = TipoContacto.Otro,
                    Comentario = "Seguimiento de consulta sobre el producto",
                    EstadoResultante = EstadoCliente.Contactado,
                    FechaGestion = new DateTime(2026, 9, 25, 11, 15, 0, DateTimeKind.Utc),
                    Asesor = "Carlos Ruiz"
                },
                new Gestion
                {
                    Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                    ClienteId = Guid.Parse("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
                    TipoContacto = TipoContacto.Llamada,
                    Comentario = "Llamada para coordinar próximo contacto",
                    EstadoResultante = EstadoCliente.Interesado,
                    FechaGestion = new DateTime(2026, 9, 28, 16, 0, 0, DateTimeKind.Utc),
                    ProximoContacto = new DateTime(2026, 10, 20, 10, 0, 0, DateTimeKind.Utc),
                    Asesor = "María González"
                }
            }
        };
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
    
}
