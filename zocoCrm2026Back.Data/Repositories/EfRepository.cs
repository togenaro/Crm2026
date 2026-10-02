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
        IQueryable<T> query = _context.Set<T>();
        foreach (var path in include)
            query = query.Include(path);

        return await query.FirstOrDefaultAsync(entity => entity.Id == id);
    }

    public async Task<IEnumerable<T>?> GetAll<T>(params string[] include)
        where T : EntityBase
    {
        IQueryable<T> query = _context.Set<T>();
        foreach (var path in include)
            query = query.Include(path);

        return await query.ToListAsync();
    }

    public async Task<T?> First<T>(
        Expression<Func<T, bool>> predicate,
        params string[] include)
        where T : EntityBase
    {
        IQueryable<T> query = _context.Set<T>();
        foreach (var path in include)
            query = query.Include(path);

        return await query.FirstOrDefaultAsync(predicate);
    }

    public async Task<IEnumerable<T>?> GetFiltered<T>(
        Expression<Func<T, bool>> predicate,
        params string[] include)
        where T : EntityBase
    {
        IQueryable<T> query = _context.Set<T>();
        foreach (var path in include)
            query = query.Include(path);

        return await query.Where(predicate).ToListAsync();
    }

    public async Task<T> Add<T>(T entity) where T : EntityBase
    {
        await _context.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<T> Update<T>(T entity) where T : EntityBase
    {
        _context.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<T> Delete<T>(T entity) where T : EntityBase
    {
        _context.Remove(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public IQueryable<T> Query<T>() where T : EntityBase
    {
        return _context.Set<T>();
    }
}
