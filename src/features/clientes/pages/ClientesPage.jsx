import { useState } from 'react';
import KpiGrid from '../components/KpiGrid';
import ClientesTable from '../components/ClientesTable';
import { clientesDisponiblesDemo, resumenClientesDemo } from '../data/clientesDemo';

const TAMANO_PAGINA = 5;

export default function ClientesPage() {
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');
  const [asesor, setAsesor] = useState('');
  const terminoBusqueda = busqueda.trim().toLocaleLowerCase('es');
  const asesores = [...new Set(clientesDisponiblesDemo.map(cliente => cliente.asesor).filter(Boolean))]
    .sort((primero, segundo) => primero.localeCompare(segundo, 'es'));
  const clientesFiltrados = clientesDisponiblesDemo.filter(cliente => {
    const coincideBusqueda = !terminoBusqueda || [cliente.nombre, cliente.cuit, cliente.telefono]
      .some(valor => valor?.toLocaleLowerCase('es').includes(terminoBusqueda));
    const coincideEstado = !estado || cliente.estado === estado;
    const coincideAsesor = !asesor || cliente.asesor?.toLocaleLowerCase('es').includes(asesor.toLocaleLowerCase('es'));

    return coincideBusqueda && coincideEstado && coincideAsesor;
  });
  const clientesVisibles = clientesFiltrados.slice(0, TAMANO_PAGINA);

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Clientes</h1>
      </header>

      <KpiGrid resumen={resumenClientesDemo} />
      <ClientesTable
        clientes={clientesVisibles}
        totalClientes={clientesFiltrados.length}
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        estado={estado}
        onEstadoChange={setEstado}
        asesor={asesor}
        onAsesorChange={setAsesor}
        asesores={asesores}
      />
    </>
  );
}
