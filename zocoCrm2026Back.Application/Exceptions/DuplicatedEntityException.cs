namespace zocoCrm2026Back.Application.Exceptions;

public class DuplicatedEntityException : Exception
{
    public DuplicatedEntityException(string message) : base(message) { }
}