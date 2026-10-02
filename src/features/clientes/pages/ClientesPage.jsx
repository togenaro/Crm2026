import { useCallback, useEffect, useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { crearCliente, actualizarCliente, eliminarCliente, listarClientes } from '../services/clienteService';
import { obtenerResumen } from '../services/dashboardService';
import KpiGrid from '../components/KpiGrid';
import ClientesTable from '../components/ClientesTable';

const TAMANO_PAGINA = 5;

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');
  const [asesor, setAsesor] = useState('');
  const [sortBy, setSortBy] = useState('proximo');
  const [sortDir, setSortDir] = useState('asc');
  const [pagina, setPagina] = useState(1);
  const { showSuccess } = useToast();

  const loadData = useCallback(async () => {
    setLoadError('');
    setCargando(true);
    const [clientesResult, resumenResult] = await Promise.allSettled([listarClientes(), obtenerResumen()]);
    if (clientesResult.status === 'fulfilled') setClientes(clientesResult.value);
    else {
      setClientes([]);
      setLoadError('No se pudieron cargar los clientes.');
    }
    setResumen(resumenResult.status === 'fulfilled' ? resumenResult.value : null);
    setCargando(false);
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  async function guardarCliente(datos, clienteId) {
    if (clienteId) {
      await actualizarCliente(clienteId, datos);
      showSuccess('Cliente actualizado.');
    } else {
      await crearCliente(datos);
      showSuccess('Cliente creado.');
      setPagina(1);
    }
    await loadData();
  }

  async function borrarClientes(ids) {
    await Promise.all(ids.map(eliminarCliente));
    showSuccess(ids.length === 1 ? 'Cliente eliminado.' : 'Clientes eliminados.');
    await loadData();
  }

  function ordenarPor(columna) {
    if (columna === sortBy) setSortDir(actual => actual === 'asc' ? 'desc' : 'asc');
    else {
      setSortBy(columna);
      setSortDir(columna === 'actualizacion' ? 'desc' : 'asc');
    }
    setPagina(1);
  }

  const terminoBusqueda = busqueda.trim().toLocaleLowerCase('es');
  const asesores = [...new Set(clientes.map(cliente => cliente.asesor).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second, 'es'));
  const clientesFiltrados = clientes.filter(cliente => {
    const coincideBusqueda = !terminoBusqueda || [cliente.nombre, cliente.cuit, cliente.telefono]
      .some(valor => valor?.toLocaleLowerCase('es').includes(terminoBusqueda));
    return coincideBusqueda && (!estado || cliente.estado === estado)
      && (!asesor || cliente.asesor?.toLocaleLowerCase('es').includes(asesor.toLocaleLowerCase('es')));
  });
  const clientesOrdenados = [...clientesFiltrados].sort((first, second) => {
    const valorFirst = sortBy === 'proximo' ? first.proximoContacto : first.fechaActualizacion;
    const valorSecond = sortBy === 'proximo' ? second.proximoContacto : second.fechaActualizacion;
    const dateFirst = valorFirst ? new Date(valorFirst).getTime() : Number.NaN;
    const dateSecond = valorSecond ? new Date(valorSecond).getTime() : Number.NaN;
    if (Number.isNaN(dateFirst) && Number.isNaN(dateSecond)) return 0;
    if (Number.isNaN(dateFirst)) return 1;
    if (Number.isNaN(dateSecond)) return -1;
    return sortDir === 'asc' ? dateFirst - dateSecond : dateSecond - dateFirst;
  });
  const totalPaginas = Math.max(1, Math.ceil(clientesOrdenados.length / TAMANO_PAGINA));
  const inicio = (pagina - 1) * TAMANO_PAGINA;
  const clientesVisibles = clientesOrdenados.slice(inicio, inicio + TAMANO_PAGINA);

  return (
    <>
      <header className="page-header"><h1 className="page-title">Clientes</h1></header>
      <KpiGrid resumen={resumen} />
      <ClientesTable
        clientes={clientesVisibles}
        todosLosClientes={clientes}
        totalClientes={clientesFiltrados.length}
        busqueda={busqueda}
        onBusquedaChange={valor => { setBusqueda(valor); setPagina(1); }}
        estado={estado}
        onEstadoChange={valor => { setEstado(valor); setPagina(1); }}
        asesor={asesor}
        onAsesorChange={valor => { setAsesor(valor); setPagina(1); }}
        asesores={asesores}
        pagina={pagina}
        totalPaginas={totalPaginas}
        onPaginaChange={setPagina}
        sortBy={sortBy}
        sortDir={sortDir}
        onOrdenar={ordenarPor}
        onGuardarCliente={guardarCliente}
        onEliminarClientes={borrarClientes}
        cargando={cargando}
        loadError={loadError}
      />
    </>
  );
}
