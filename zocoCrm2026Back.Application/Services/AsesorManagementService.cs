using System.Security.Cryptography;
using zocoCrm2026Back.Application.Dtos;
using zocoCrm2026Back.Application.Exceptions;
using zocoCrm2026Back.Domain.Entities;
using zocoCrm2026Back.Domain.Interfaces;

namespace zocoCrm2026Back.Application.Services;

public class AsesorManagementService
{
    private readonly IRepository _repository;
    public AsesorManagementService(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<AsesorModel.AsesorResponse>> GetAsesores()
    {
        var asesores = await _repository.GetAll<Asesor>() ?? Enumerable.Empty<Asesor>();
        return asesores
            .OrderBy(asesor => asesor.Nombre)
            .Select(asesor => new AsesorModel.AsesorResponse(
                asesor.Id, asesor.Usuario, asesor.Nombre))
            .ToList();
    }

    public async Task<AsesorModel.AsesorResponse> AddAsesor(AsesorModel.AsesorRequest request)
    {
        ValidateRequest(request.Usuario, request.Nombre, request.Password);

        var usuario = request.Usuario.Trim();
        var exist = await _repository.First<Asesor>(
            asesor => asesor.Usuario.ToLower() == usuario.ToLower());

        if (exist != null)
            throw new DuplicatedEntityException(
                $"Ya existe un asesor con el usuario {usuario}.");

        var asesor = new Asesor
        {
            Usuario = usuario,
            Nombre = request.Nombre.Trim()
        };
        asesor.PasswordHash = HashPassword(request.Password);

        await _repository.Add(asesor);

        return new AsesorModel.AsesorResponse(asesor.Id, asesor.Usuario, asesor.Nombre);
    }

    public async Task<AsesorModel.AsesorResponse?> Login(AsesorModel.LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Usuario) || string.IsNullOrWhiteSpace(request.Password))
            return null;

        var usuario = request.Usuario.Trim();
        var asesor = await _repository.First<Asesor>(
            item => item.Usuario.ToLower() == usuario.ToLower());

        if (asesor == null || !VerifyPassword(request.Password, asesor.PasswordHash))
            return null;

        return new AsesorModel.AsesorResponse(asesor.Id, asesor.Usuario, asesor.Nombre);
    }

    private void ValidateRequest(string usuario, string nombre, string password)
    {
        var errores = new List<string>();

        if (string.IsNullOrWhiteSpace(usuario) || usuario.Trim().Length < 3 || usuario.Trim().Length > 50)
            errores.Add("El usuario es obligatorio y debe tener entre 3 y 50 caracteres.");

        if (string.IsNullOrWhiteSpace(nombre) || nombre.Trim().Length < 3 || nombre.Trim().Length > 100)
            errores.Add("El nombre es obligatorio y debe tener entre 3 y 100 caracteres.");

        if (string.IsNullOrWhiteSpace(password) || password.Length < 4 || password.Length > 100)
            errores.Add("La contraseña es obligatoria y debe tener entre 4 y 100 caracteres.");

        if (errores.Any())
            throw new ValidationException(errores);
    }

    private static string HashPassword(string password)
    {
        const int iterations = 100_000;
        var salt = RandomNumberGenerator.GetBytes(16);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            password, salt, iterations, HashAlgorithmName.SHA256, 32);

        return $"{iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    private static bool VerifyPassword(string password, string passwordHash)
    {
        var parts = passwordHash.Split('.');
        if (parts.Length != 3 || !int.TryParse(parts[0], out var iterations))
            return false;

        try
        {
            var salt = Convert.FromBase64String(parts[1]);
            var expectedHash = Convert.FromBase64String(parts[2]);
            var actualHash = Rfc2898DeriveBytes.Pbkdf2(
                password, salt, iterations, HashAlgorithmName.SHA256, expectedHash.Length);

            return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
        }
        catch (FormatException)
        {
            return false;
        }
    }
}
