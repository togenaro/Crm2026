using Microsoft.EntityFrameworkCore;
using zocoCrm2026Back.Domain.Entities;

namespace zocoCrm2026Back.Data;

public class ZocoCrmContext : DbContext
{
    public ZocoCrmContext(DbContextOptions<ZocoCrmContext> options)
        : base(options)
    {
    }

    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Gestion> Gestiones => Set<Gestion>();
    public DbSet<Asesor> Asesores => Set<Asesor>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Asesor>(entity =>
        {
            entity.ToTable("Asesores");
            entity.Property(asesor => asesor.Usuario).HasMaxLength(50).IsRequired();
            entity.Property(asesor => asesor.Nombre).HasMaxLength(100).IsRequired();
            entity.Property(asesor => asesor.PasswordHash).HasMaxLength(500).IsRequired();
            entity.HasIndex(asesor => asesor.Usuario).IsUnique();
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.ToTable("Clientes");
            entity.Property(cliente => cliente.Nombre).HasMaxLength(100);
            entity.Property(cliente => cliente.Cuit).HasMaxLength(20);
            entity.Property(cliente => cliente.Telefono).HasMaxLength(30);
            entity.Property(cliente => cliente.Email).HasMaxLength(100);
            entity.Property(cliente => cliente.Asesor).HasMaxLength(100);
            entity.Property(cliente => cliente.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Gestion>(entity =>
        {
            entity.ToTable("Gestiones");
            entity.Property(gestion => gestion.Comentario).HasMaxLength(500);
        });
    }
}
