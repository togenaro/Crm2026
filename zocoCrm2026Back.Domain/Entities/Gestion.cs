namespace zocoCrm2026Back.Domain.Entities;

public class Gestion : EntityBase
{
    #region Relaciones con otras entidades
    public Guid ClienteId { get; set; }
    public Cliente? Cliente { get; set; }
    #endregion

    #region Propiedades propias de la entidad
    public TipoContacto TipoContacto { get; set; }
    public string? Comentario { get; set; }
    public EstadoCliente EstadoResultante { get; set; }
    public DateTime FechaGestion { get; set; } = DateTime.UtcNow;
    public DateTime? ProximoContacto { get; set; }
    public string? Asesor { get; set; }
    #endregion

    #region Constructor por defecto
    public Gestion()
    {
    }
    #endregion
}