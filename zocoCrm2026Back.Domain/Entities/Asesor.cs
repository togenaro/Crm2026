namespace zocoCrm2026Back.Domain.Entities;

public class Asesor : EntityBase
{
    public string Usuario { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
}
