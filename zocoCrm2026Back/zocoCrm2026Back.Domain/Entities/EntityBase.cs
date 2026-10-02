namespace zocoCrm2026Back.Domain.Entities;

public abstract class EntityBase
{
    protected EntityBase()
    {
        Id = Guid.NewGuid();
    }

    public Guid Id { get; set; }
}
