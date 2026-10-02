import { useCallback, useEffect, useState } from 'react';
import {
  IconArrowUpDown,
  IconCalendar,
  IconSearch,
} from '../../../components/ui/Icons';
import GestionCard from '../components/GestionCard';
import GestionesFormModal from '../components/GestionesFormModal';
import EmptyState from '../../../components/ui/EmptyState';
import Pagination from '../../../components/ui/Pagination';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { listarClientes } from '../../clientes/services/clienteService';
import { crearGestion, actualizarGestion, listarGestiones } from '../services/gestionService';
import { sortGestionesByDate, TIPOS_CONTACTO } from '../gestionHelpers';

const TAMANO_PAGINA = 5;

export default function GestionesPage() {
  const [clientes, setClientes] = useState([]);
  const [gestiones, setGestiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [mostrarModalGestion, setMostrarModalGestion] = useState(false);
  const [gestionAEditar, setGestionAEditar] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('');
  const [asesor, setAsesor] = useState('');
  const [sortDir, setSortDir] = useState('desc');
  const [pagina, setPagina] = useState(1);
  const { usuario } = useAuth();
  const { showSuccess } = useToast();

  const loadData = useCallback(async () => {
    setCargando(true);
    setLoadError('');
    const [clientesResult, gestionesResult] = await Promise.allSettled([listarClientes(), listarGestiones()]);
    if (clientesResult.status === 'fulfilled') setClientes(clientesResult.value);
    else setClientes([]);
    if (gestionesResult.status === 'fulfilled') setGestiones(gestionesResult.value);
    else {
      setGestiones([]);
      setLoadError('No se pudieron cargar las gestiones.');
    }
    if (clientesResult.status === 'rejected' && gestionesResult.status === 'fulfilled') {
      setLoadError('No se pudieron cargar los clientes.');
    }
    setCargando(false);
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  async function guardarGestion(datos) {
    if (gestionAEditar) {
      await actualizarGestion(datos.clienteId, gestionAEditar.id, datos);
      showSuccess('Gestión actualizada.');
    } else {
      const cliente = clientes.find(item => String(item.id) === String(datos.clienteId));
      if (!cliente) throw new Error('Seleccioná un cliente válido para registrar la gestión.');
      await crearGestion(cliente.id, { ...datos, asesor: usuario?.nombre || cliente.asesor });
      showSuccess('Gestión registrada.');
    }
    setGestionAEditar(null);
    setPagina(1);
    setMostrarModalGestion(false);
    void loadData();
  }
  const terminoBusqueda = busqueda.trim().toLocaleLowerCase('es');
  const asesores = [...new Set(gestiones.map(gestion => gestion.asesor).filter(Boolean))]
    .sort((primero, segundo) => primero.localeCompare(segundo, 'es'));
  const gestionesFiltradas = sortGestionesByDate(gestiones, sortDir === 'desc')
    .filter(gestion => {
      const coincideBusqueda = !terminoBusqueda || [
        gestion.clienteNombre,
        gestion.comentario,
        gestion.asesor,
      ].some(valor => valor?.toLocaleLowerCase('es').includes(terminoBusqueda));
      const coincideTipo = !tipo || gestion.tipoContacto === tipo;
      const coincideAsesor = !asesor || gestion.asesor === asesor;

      return coincideBusqueda && coincideTipo && coincideAsesor;
    });
  const totalPaginas = Math.max(1, Math.ceil(gestionesFiltradas.length / TAMANO_PAGINA));
  const indiceInicial = (pagina - 1) * TAMANO_PAGINA;
  const gestionesVisibles = gestionesFiltradas.slice(indiceInicial, indiceInicial + TAMANO_PAGINA);

  return (
    <div className="gestiones-view">
      <header className="page-header">
        <h1 className="page-title">Gestiones</h1>
      </header>

      <section className="list-container" aria-label="Listado de gestiones">
        <div className="table-info-bar">
          <div className="table-info-bar-left">
            <IconCalendar />
            <span>
              {loadError || (cargando
                ? 'Cargando gestiones…'
                : <>Total Gestiones: <strong>{gestionesFiltradas.length} {gestionesFiltradas.length === 1 ? 'gestión' : 'gestiones'}</strong></>)}
            </span>
          </div>

          <div className="table-info-bar-right">
            <label className="search-input-wrap">
              <IconSearch />
              <input
                className="search-input"
                type="search"
                placeholder="Buscar por cliente, comentario o asesor…"
                aria-label="Buscar gestiones"
                value={busqueda}
                onChange={event => {
                  setBusqueda(event.target.value);
                  setPagina(1);
                }}
              />
            </label>
            <select className="filter-select" value={tipo} onChange={event => {
              setTipo(event.target.value);
              setPagina(1);
            }} aria-label="Filtrar por tipo">
              <option value="">Todos los tipos</option>
              {TIPOS_CONTACTO.map(tipo => <option key={tipo}>{tipo}</option>)}
            </select>
            <select className="filter-select" value={asesor} onChange={event => {
              setAsesor(event.target.value);
              setPagina(1);
            }} aria-label="Filtrar por asesor">
              <option value="">Todos los asesores</option>
              {asesores.map(nombre => <option key={nombre}>{nombre}</option>)}
            </select>
            <button
              className="btn btn-outline btn-sm"
              type="button"
              title="Cambiar orden por fecha"
              onClick={() => {
                setSortDir(actual => actual === 'desc' ? 'asc' : 'desc');
                setPagina(1);
              }}
            >
              <IconArrowUpDown /> {sortDir === 'desc' ? 'Recientes' : 'Antiguas'}
            </button>
            <button className="btn btn-primary btn-sm" type="button" onClick={() => {
              setGestionAEditar(null);
              setMostrarModalGestion(true);
            }}>
              Nueva gestión
            </button>
          </div>
        </div>

        <div className="full-history-list">
          {loadError || cargando || gestionesFiltradas.length === 0 ? (
            <EmptyState
              icon={!cargando ? IconCalendar : null}
              message={loadError || (cargando ? 'Cargando gestiones…' : 'No se encontraron gestiones.')}
              isError={Boolean(loadError)}
            />
          ) : gestionesVisibles.map(gestion => {
            const cliente = clientes.find(item => item.cuit === gestion.clienteCuit);

            return (
              <GestionCard
                key={gestion.id}
                gestion={gestion}
                clienteId={cliente?.id}
                onClickGestion={seleccionada => {
                  setGestionAEditar(seleccionada);
                  setMostrarModalGestion(true);
                }}
              />
            );
          })}
        </div>

        {!loadError && !cargando && (
          <Pagination
            page={pagina}
            totalPages={totalPaginas}
            totalItems={gestionesFiltradas.length}
            pageSize={TAMANO_PAGINA}
            onPageChange={setPagina}
          />
        )}
      </section>
      {mostrarModalGestion && (
        <GestionesFormModal
          clientes={clientes}
          editingGestion={gestionAEditar}
          onClose={() => {
            setGestionAEditar(null);
            setMostrarModalGestion(false);
          }}
          onGuardar={guardarGestion}
        />
      )}
    </div>
  );
}
