using Microsoft.EntityFrameworkCore;
using zocoCrm2026Back.Application.Dtos;
using zocoCrm2026Back.Application.Exceptions;
using zocoCrm2026Back.Application.Services;
using zocoCrm2026Back.Data;
using zocoCrm2026Back.Data.Repositories;
using zocoCrm2026Back.Domain.Entities;
using Xunit;

namespace zocoCrm2026Back.Tests;

public class ReglasNegocioTests
{
    private static ZocoCrmContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<ZocoCrmContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ZocoCrmContext(options);
    }

    [Fact]
    public async Task CrearCliente_ConCuitDuplicado_LanzaExcepcion()
    {
        await using var context = CreateContext();
        var repository = new EfRepository(context);
        var clienteService = new ClienteManagementService(repository);

        var primerCliente = new ClienteModel.ClienteRequest(
            "Empresa Test A",
            "30-99999999-9",
            "11-2222-3333",
            "contacto@testa.com",
            EstadoCliente.Prospecto,
            "Laura Gómez");

        await clienteService.AddCliente(primerCliente);

        var segundoCliente = new ClienteModel.ClienteRequest(
            "Empresa Test B",
            "30-99999999-9",
            "11-4444-5555",
            "contacto@testb.com",
            EstadoCliente.Contactado,
            "Carlos Ruiz");

        await Assert.ThrowsAsync<DuplicatedEntityException>(
            () => clienteService.AddCliente(segundoCliente));
    }

    [Fact]
    public async Task RegistrarGestion_ActualizaEstadoYProximoContactoDelCliente()
    {
        await using var context = CreateContext();
        var repository = new EfRepository(context);
        var clienteService = new ClienteManagementService(repository);
        var gestionService = new GestionManagementService(repository);

        var clienteRequest = new ClienteModel.ClienteRequest(
            "Cliente Pruebas SRL",
            "30-88888888-8",
            "11-1111-2222",
            "info@pruebas.com",
            EstadoCliente.Prospecto,
            "Asesor Test");

        var cliente = await clienteService.AddCliente(clienteRequest);
        var proximaFecha = DateTime.UtcNow.AddDays(7).Date;
        var gestionRequest = new GestionModel.GestionRequest(
            "Reunion",
            "Se cerró contrato comercial satisfactoriamente.",
            "Cliente",
            FechaGestion: DateTime.UtcNow,
            ProximoContacto: proximaFecha);

        await gestionService.AddGestion(cliente.Id, gestionRequest);

        var clienteActualizado = await clienteService.GetClienteById(cliente.Id);

        Assert.Equal(EstadoCliente.Cliente, clienteActualizado.Estado);
        Assert.NotNull(clienteActualizado.ProximoContacto);
        Assert.Equal(proximaFecha, clienteActualizado.ProximoContacto.Value.Date);
    }
}
