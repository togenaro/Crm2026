namespace zocoCrm2026Back.Domain.Entities;

public class Cliente : EntityBase
{
    #region Relaciones con otras entidades
    public virtual ICollection<Gestion> Gestiones { get; set; } = new List<Gestion>();
    #endregion

    #region Propiedades propias de la entidad
    public string? Nombre { get; set; }
    public string? Cuit { get; set; }
    public string? Telefono { get; set; }
    public string? Email { get; set; }
    public EstadoCliente Estado { get; set; } = EstadoCliente.Prospecto;
    public string? Asesor { get; set; }
    public DateTime? ProximoContacto { get; set; }
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public DateTime FechaActualizacion { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    #endregion

    #region Constructor por defecto
    public Cliente()
    {
    }
    #endregion
}