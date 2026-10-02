using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using zocoCrm2026Back.Domain.Entities;
using zocoCrm2026Back.Domain.Interfaces;

namespace zocoCrm2026Back.Data.Repositories;

public class EfRepository : IRepository
{
    private readonly ZocoCrmContext _context;

    public EfRepository(ZocoCrmContext context)
    {
        _context = context;
    }

    public async Task<T?> GetById<T>(Guid id, params string[] include)
        where T : EntityBase
    {
        var query = Include(_context.Set<T>(), include);
        return await query.FirstOrDefaultAsync(entity => entity.Id == id);
    }

    public async Task<IEnumerable<T>?> GetAll<T>(params string[] include)
        where T : EntityBase
    {
        var query = Include(_context.Set<T>(), include);
        return await query.ToListAsync();
    }

    public async Task<T?> First<T>(
        Expression<Func<T, bool>> predicate,
        params string[] include)
        where T : EntityBase
    {
        var query = Include(_context.Set<T>(), include);
        return await query.FirstOrDefaultAsync(predicate);
    }

    public async Task<IEnumerable<T>?> GetFiltered<T>(
        Expression<Func<T, bool>> predicate,
        params string[] include)
        where T : EntityBase
    {
        var query = Include(_context.Set<T>(), include);
        return await query.Where(predicate).ToListAsync();
    }

    public async Task<T> Add<T>(T entity) where T : EntityBase
    {
        await _context.AddAsync(entity);
        return await SaveAndReturnAsync(entity);
    }

    public async Task<T> Update<T>(T entity) where T : EntityBase
    {
        _context.Update(entity);
        return await SaveAndReturnAsync(entity);
    }

    public async Task<T> Delete<T>(T entity) where T : EntityBase
    {
        _context.Remove(entity);
        return await SaveAndReturnAsync(entity);
    }

    public IQueryable<T> Query<T>() where T : EntityBase
    {
        return _context.Set<T>();
    }

    private static IQueryable<T> Include<T>(IQueryable<T> query, string[] paths)
        where T : EntityBase
    {
        foreach (var path in paths)
            query = query.Include(path);

        return query;
    }

    private async Task<T> SaveAndReturnAsync<T>(T entity) where T : EntityBase
    {
        await _context.SaveChangesAsync();
        return entity;
    }
}
