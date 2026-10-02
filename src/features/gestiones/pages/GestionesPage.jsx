import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { IconSearch, IconCalendar, IconArrowUpDown } from '../../../components/ui/Icons';
import GestionesFormModal from '../components/GestionesFormModal';
import GestionCard from '../components/GestionCard';
import { sortGestionesByDate, TIPOS_CONTACTO } from '../gestionHelpers';
import { gestionService } from '../services/gestionService';
import { useToast } from '../../../context/ToastContext';
import Pagination from '../../../components/ui/Pagination';
import EmptyState from '../../../components/ui/EmptyState';
import { clienteService } from '../../clientes/services/clienteService';
import { asesorService } from '../../clientes/services/asesorService';

const PAGE_SIZE = 5;

export default function GestionesPage() {
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [gestiones, setGestiones] = useState([]);
  const [asesores, setAsesores] = useState([]);
  const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 0, page: 1 });
  const [search, setSearch] = useState('');
  const [tipo, setTipo] = useState('');
  const [asesor, setAsesor] = useState('');
  const [sortDir, setSortDir] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [editingGestion, setEditingGestion] = useState(null);
  const [page, setPage] = useState(1);
  const [loadError, setLoadError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAsesores = async () => {
      try {
        const result = await asesorService.getAsesores();
        setAsesores(result.map(item => item.nombre));
      } catch (err) {
        console.error('Error cargando asesores desde API:', err);
        setAsesores([]);
      }
    };

    loadAsesores();
  }, []);

  const loadData = async (requestedPage = page) => {
    setIsLoading(true);
    setLoadError('');
    try {
      const [result, clientesResult] = await Promise.all([
        gestionService.getGestiones({
          page: requestedPage,
          pageSize: PAGE_SIZE,
          search,
          tipo,
          asesor,
        }),
        clienteService.getClientes({ page: 1, pageSize: 1000 }),
      ]);
      const items = result?.items || [];
      setGestiones(items);
      setPagination(result);
      setClientes(clientesResult?.items || []);
    } catch (err) {
      console.error('Error cargando gestiones desde API:', err);
      setGestiones([]);
      setClientes([]);
      setLoadError('No se pudieron cargar las gestiones.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, search, tipo, asesor]);

  const byId = new Map(clientes.map(c => [String(c.id), c]));
  const asesoresDisponibles = [...asesores].sort((a, b) => a.localeCompare(b, 'es'));

  const filtered = sortGestionesByDate(gestiones, sortDir === 'desc');
  const currentPage = pagination.page || page;
  const pageItems = filtered;

  const handleAddGestion = async (nuevaGestion, nuevoEstado, proximoContacto) => {
    if (editingGestion) {
      await gestionService.updateGestion(
        nuevaGestion.clienteId,
        editingGestion.id,
        nuevaGestion,
        nuevoEstado,
        proximoContacto,
      );
      showSuccess('Gestión actualizada.');
    } else {
      await gestionService.addGestion(
        nuevaGestion.clienteId,
        nuevaGestion,
        nuevoEstado,
        proximoContacto,
        usuario?.nombre,
      );
      showSuccess('Gestión registrada.');
    }
    setShowModal(false);
    setEditingGestion(null);
    setPage(1);
    await loadData(1);
  };

  return (
    <div className="gestiones-view">
      <div className="page-header">
        <h1 className="page-title">Gestiones</h1>
      </div>

      <div className="list-container">
        <div className="table-info-bar">
          <div className="table-info-bar-left">
            <IconCalendar />
            <span>
              {loadError || (isLoading ? 'Cargando gestiones…' : <>Total Gestiones: <strong>{pagination.totalItems || 0} {(pagination.totalItems || 0) === 1 ? 'gestión' : 'gestiones'}</strong></>)}
            </span>
          </div>
          <div className="table-info-bar-right">
            <div className="search-input-wrap">
              <IconSearch />
              <input
                className="search-input"
                type="text"
                placeholder="Buscar por cliente, comentario o asesor…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <select
              className="filter-select"
              value={tipo}
              onChange={e => { setTipo(e.target.value); setPage(1); }}
            >
              <option value="">Todos los tipos</option>
              {TIPOS_CONTACTO.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              className="filter-select"
              value={asesor}
              onChange={e => { setAsesor(e.target.value); setPage(1); }}
              aria-label="Filtrar gestiones por asesor"
            >
              <option value="">Todos los asesores</option>
              {asesoresDisponibles.map(nombre => <option key={nombre} value={nombre}>{nombre}</option>)}
            </select>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              title="Cambiar orden por fecha"
              onClick={() => { setSortDir(d => d === 'desc' ? 'asc' : 'desc'); setPage(1); }}
            >
              <IconArrowUpDown /> {sortDir === 'desc' ? 'Recientes' : 'Antiguas'}
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              Nueva gestión
            </button>
          </div>
        </div>

        <div className="full-history-list">
          {loadError || isLoading || filtered.length === 0 ? (
            <EmptyState
              icon={!isLoading ? IconCalendar : null}
              message={loadError || (isLoading ? 'Cargando gestiones…' : 'No se encontraron gestiones.')}
              isError={Boolean(loadError)}
            />
          ) : (
            pageItems.map(g => {
              const cliente = byId.get(String(g.clienteId));
              return (
                <GestionCard
                  key={g.id}
                  gestion={g}
                  cliente={cliente}
                  onClickGestion={gestion => {
                    setEditingGestion(gestion);
                    setShowModal(true);
                  }}
                  onClickCliente={(c, fallbackId) => {
                    const id = c?.id || fallbackId || g.clienteId;
                    if (id) navigate(`/clientes/${id}`, { state: { from: '/gestiones' } });
                  }}
                />
              );
            })
          )}
        </div>

        {!loadError && !isLoading && (
          <Pagination
            page={currentPage}
            totalPages={pagination.totalPages || 0}
            totalItems={pagination.totalItems || 0}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </div>

      {showModal && (
        <GestionesFormModal
          clientes={clientes}
          usuario={usuario}
            initialClienteId={editingGestion?.clienteId || ''}
            lockCliente={Boolean(editingGestion)}
            editingGestion={editingGestion}
            onClose={() => { setShowModal(false); setEditingGestion(null); }}
          onSubmit={handleAddGestion}
        />
      )}
    </div>
  );
}
