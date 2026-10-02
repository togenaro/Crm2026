namespace zocoCrm2026Back.Application.Exceptions;

public class ValidationException : Exception
{
    public List<string> Errors { get; }

    public ValidationException(List<string> errors)
        : base("Errores de validación.")
    {
        Errors = errors;
    }
}