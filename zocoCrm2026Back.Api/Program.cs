using zocoCrm2026Back.Application.Services;
using zocoCrm2026Back.Data;
using zocoCrm2026Back.Data.Helpers;
using zocoCrm2026Back.Api.Middlewares;
using zocoCrm2026Back.Domain.Entities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// Mantiene el formato de errores de binding de la API de referencia.
builder.Services.Configure<Microsoft.AspNetCore.Mvc.ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errores = context.ModelState
            .Where(entry => entry.Value?.Errors.Count > 0)
            .SelectMany(entry => entry.Value!.Errors.Select(error => new
            {
                Campo = entry.Key,
                Error = error
            }))
            .Select(item =>
            {
                var campo = item.Campo.Split('.').Last();
                var mensaje = item.Error.ErrorMessage;

                if (mensaje.Contains("could not be converted", StringComparison.OrdinalIgnoreCase)
                    || mensaje.Contains("required", StringComparison.OrdinalIgnoreCase))
                {
                    if (campo.Contains("ProximoContacto", StringComparison.OrdinalIgnoreCase)
                        || campo.Contains("Fecha", StringComparison.OrdinalIgnoreCase))
                        return "La fecha ingresada no es válida.";

                    if (campo.Contains("Id", StringComparison.OrdinalIgnoreCase))
                        return "El valor ingresado en 'id' no es válido.";

                    return $"El valor ingresado en '{campo}' no es válido.";
                }

                return mensaje;
            })
            .ToList();

        return new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(new { errores });
    };
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddPersistence(builder.Configuration);
builder.Services.AddScoped<ClienteManagementService>();
builder.Services.AddScoped<GestionManagementService>();
builder.Services.AddScoped<DashboardService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ZocoCrmContext>();
    context.Seedwork<Cliente>("Sources/clientes.json");
    context.Seedwork<Gestion>("Sources/gestiones.json");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseAuthorization();
app.MapControllers();
app.Run();
