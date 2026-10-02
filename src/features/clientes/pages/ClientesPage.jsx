import { useState } from 'react';
import KpiGrid from '../components/KpiGrid';
import ClientesTable from '../components/ClientesTable';
import { clientesDisponiblesDemo, resumenClientesDemo } from '../data/clientesDemo';

const TAMANO_PAGINA = 5;

export default function ClientesPage() {
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');
  const [asesor, setAsesor] = useState('');
  const [sortBy, setSortBy] = useState('proximo');
  const [sortDir, setSortDir] = useState('asc');
  const [pagina, setPagina] = useState(1);

  function ordenarPor(columna) {
    if (columna === sortBy) {
      setSortDir(actual => actual === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columna);
      setSortDir(columna === 'actualizacion' ? 'desc' : 'asc');
    }
    setPagina(1);
  }

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
  const clientesOrdenados = [...clientesFiltrados].sort((primero, segundo) => {
    const valorPrimero = sortBy === 'proximo' ? primero.proximoContacto : primero.fechaActualizacion;
    const valorSegundo = sortBy === 'proximo' ? segundo.proximoContacto : segundo.fechaActualizacion;
    const fechaPrimero = valorPrimero ? new Date(valorPrimero).getTime() : Number.NaN;
    const fechaSegundo = valorSegundo ? new Date(valorSegundo).getTime() : Number.NaN;
    const primeroSinFecha = Number.isNaN(fechaPrimero);
    const segundoSinFecha = Number.isNaN(fechaSegundo);

    if (primeroSinFecha && segundoSinFecha) return 0;
    if (primeroSinFecha) return 1;
    if (segundoSinFecha) return -1;

    return sortDir === 'asc' ? fechaPrimero - fechaSegundo : fechaSegundo - fechaPrimero;
  });
  const totalPaginas = Math.max(1, Math.ceil(clientesOrdenados.length / TAMANO_PAGINA));
  const indiceInicial = (pagina - 1) * TAMANO_PAGINA;
  const clientesVisibles = clientesOrdenados.slice(indiceInicial, indiceInicial + TAMANO_PAGINA);
  const numeroInicial = clientesOrdenados.length === 0 ? 0 : indiceInicial + 1;
  const numeroFinal = Math.min(indiceInicial + TAMANO_PAGINA, clientesOrdenados.length);

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Clientes</h1>
      </header>

      <KpiGrid resumen={resumenClientesDemo} />
      <ClientesTable
        clientes={clientesVisibles}
        todosLosClientes={clientesDisponiblesDemo}
        totalClientes={clientesFiltrados.length}
        busqueda={busqueda}
        onBusquedaChange={valor => {
          setBusqueda(valor);
          setPagina(1);
        }}
        estado={estado}
        onEstadoChange={valor => {
          setEstado(valor);
          setPagina(1);
        }}
        asesor={asesor}
        onAsesorChange={valor => {
          setAsesor(valor);
          setPagina(1);
        }}
        asesores={asesores}
        pagina={pagina}
        totalPaginas={totalPaginas}
        onPaginaChange={setPagina}
        numeroInicial={numeroInicial}
        numeroFinal={numeroFinal}
        sortBy={sortBy}
        sortDir={sortDir}
        onOrdenar={ordenarPor}
      />
    </>
  );
}
