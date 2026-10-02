import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { clienteService } from '../services/clienteService';
import { gestionService } from '../../gestiones/services/gestionService';
import {
  IconCalendar, IconPlus, IconUser, IconTrendingUp, IconStatus,
  IconAlertTriangle, IconEdit, IconMail, IconPhone, IconArrowUpDown,
} from '../../../components/ui/Icons';
import { formatDate } from '../../../utils/helpers';
import { badgeClass, isOverdue } from '../clienteHelpers';
import { sortGestionesByDate } from '../../gestiones/gestionHelpers';
import ClienteFormModal from '../components/ClienteFormModal';
import GestionesFormModal from '../../gestiones/components/GestionesFormModal';
import GestionCard from '../../gestiones/components/GestionCard';
import { useToast } from '../../../context/ToastContext';
import Pagination from '../../../components/ui/Pagination';

const GESTIONES_PAGE_SIZE = 5;

export default function ClienteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = location.state?.from === '/gestiones' ? '/gestiones' : '/clientes';
  const { usuario } = useAuth();
  const { showSuccess } = useToast();

  const [cliente, setCliente] = useState(null);
  const [clientGestiones, setClientGestiones] = useState([]);
  const [gestionPage, setGestionPage] = useState(1);
  const [gestionPagination, setGestionPagination] = useState({ totalItems: 0, totalPages: 1 });
  const [allClientes, setAllClientes] = useState([]);
  const [clienteError, setClienteError] = useState('');
  const [gestionesError, setGestionesError] = useState('');
  const [isLoadingGestiones, setIsLoadingGestiones] = useState(true);
  const [ordenRecientes, setOrdenRecientes] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGestionModal, setShowGestionModal] = useState(false);
  const [editingGestion, setEditingGestion] = useState(null);

  const loadData = async (requestedPage = gestionPage, recentFirst = ordenRecientes) => {
    setClienteError('');
    setGestionesError('');
    setIsLoadingGestiones(true);
    let c;
    try {
      c = await clienteService.getClienteById(id);
    } catch (err) {
      if (err.response?.status === 404) {
        navigate('/clientes');
        return;
      }
      console.error(`Error cargando cliente ${id}:`, err);
      setCliente(null);
      setClienteError('No se pudieron cargar los datos del cliente.');
      setIsLoadingGestiones(false);
      return;
    }
    if (!c) {
      navigate('/clientes');
      return;
    }
    setCliente(c);
    setAllClientes([c]);

    try {
      const firstPage = await gestionService.getGestionesByCliente(id, {
        page: 1,
        pageSize: GESTIONES_PAGE_SIZE,
      });
      const totalPages = Math.max(firstPage.totalPages || 1, 1);
      const apiPage = recentFirst ? requestedPage : totalPages - requestedPage + 1;
      const gRes = apiPage === 1
        ? firstPage
        : await gestionService.getGestionesByCliente(id, {
        page: apiPage,
        pageSize: GESTIONES_PAGE_SIZE,
      });
      setClientGestiones(gRes.items || []);
      setGestionPagination({ totalItems: gRes.totalItems || 0, totalPages });
    } catch (err) {
      console.error(`Error cargando gestiones para cliente ${id}:`, err);
      setClientGestiones([]);
      setGestionPagination({ totalItems: 0, totalPages: 1 });
      setGestionesError('No se pudieron cargar las gestiones de este cliente.');
    } finally {
      setIsLoadingGestiones(false);
    }
  };

  useEffect(() => {
    setGestionPage(1);
  }, [id]);

  useEffect(() => {
    loadData(gestionPage, ordenRecientes);
  }, [id, gestionPage, ordenRecientes]);

  if (clienteError) {
    return <div className="error-banner">{clienteError}</div>;
  }
  if (!cliente) return <div className="empty-state">Cargando cliente…</div>;

  const gestionesOrdenadas = sortGestionesByDate(clientGestiones, ordenRecientes);

  const vencido = isOverdue(cliente.proximoContacto);

  const handleGestionSubmit = async (nuevaGestion, nuevoEstado, proximoContacto) => {
    if (!nuevaGestion?.comentario?.trim()) return;

    if (editingGestion) {
      await gestionService.updateGestion(
        cliente.id,
        editingGestion.id,
        nuevaGestion,
        nuevoEstado,
        proximoContacto,
      );
      showSuccess('Gestión actualizada.');
    } else {
      await gestionService.addGestion(
        cliente.id,
        nuevaGestion,
        nuevoEstado,
        proximoContacto,
        usuario?.nombre,
      );
      showSuccess('Gestión registrada.');
    }
    setShowGestionModal(false);
    setEditingGestion(null);
    await loadData(gestionPage, ordenRecientes);
  };

  const handleUpdateCliente = async (patch) => {
    await clienteService.updateCliente(cliente.id, patch);
    showSuccess('Cliente actualizado.');
    setShowEditModal(false);
    await loadData(gestionPage, ordenRecientes);
  };

  return (
    <div className="full-view-container">
      {/* Cabecera */}
      <div className="page-header">
        <div>
          <div className="detail-title-row">
            <h1 className="page-title">{cliente.nombre}</h1>
            <button type="button" className="action-btn" onClick={() => setShowEditModal(true)} title="Editar cliente">
              <IconEdit />
            </button>
          </div>
          <div className="detail-subtitle">CUIT {cliente.cuit}</div>
          <div className="detail-subtitle detail-contact"><IconMail /> {cliente.email || '—'}</div>
          <div className="detail-subtitle detail-contact"><IconPhone /> {cliente.telefono}</div>
        </div>
        <div className="page-actions">
          <button type="button" className="btn-back-discrete" onClick={() => navigate(returnPath)}>
            ← Volver a {returnPath === '/gestiones' ? 'Gestiones' : 'Clientes'}
          </button>
        </div>
      </div>

      {/* Tarjeta de Datos Rápidos */}
      <div className="full-view-meta-card">
        <div className="full-meta-item">
          <span className="full-meta-label"><IconStatus /> Estado actual</span>
          <span className="full-meta-value"><span className={`badge ${badgeClass(cliente.estado)}`}>{cliente.estado}</span></span>
        </div>
        <div className="full-meta-item">
          <span className="full-meta-label"><IconUser /> Asesor Asignado</span>
          <span className="full-meta-value">{cliente.asesor}</span>
        </div>
        <div className="full-meta-item">
          <span className="full-meta-label"><IconCalendar /> Próximo Contacto</span>
          <span className={`full-meta-value${vencido ? ' overdue' : ''}`}>
            {vencido && <IconAlertTriangle />}{formatDate(cliente.proximoContacto)}
          </span>
        </div>
        <div className="full-meta-item">
          <span className="full-meta-label"><IconTrendingUp /> Última Actualización</span>
          <span className="full-meta-value">{formatDate(cliente.fechaActualizacion)}</span>
        </div>
      </div>

      {/* Historial de Gestiones a Ancho Completo */}
      <div className="full-view-history-col" style={{ width: '100%' }}>
        <div className="list-container">
          <div className="table-info-bar">
            <div className="table-info-bar-left">
              <strong>Historial de Gestiones ({gestionesError ? '—' : gestionPagination.totalItems})</strong>
            </div>
            <div className="table-info-bar-right">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                title="Cambiar orden por fecha"
                onClick={() => setOrdenRecientes(v => !v)}
              >
                <IconArrowUpDown /> {ordenRecientes ? 'Recientes' : 'Antiguas'}
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => { setEditingGestion(null); setShowGestionModal(true); }}>
                <IconPlus /> Nueva gestión
              </button>
            </div>
          </div>
          <div className="full-history-list">
            {gestionesError || isLoadingGestiones || clientGestiones.length === 0 ? (
              <div className={gestionesError ? 'error-banner' : 'empty-state'}>
                <p>{gestionesError || (isLoadingGestiones ? 'Cargando gestiones…' : 'No hay gestiones registradas para este cliente.')}</p>
              </div>
            ) : (
              gestionesOrdenadas.map(g => (
                <GestionCard
                  key={g.id}
                  gestion={g}
                  cliente={cliente}
                  showCliente={false}
                  onClickGestion={gestion => {
                    setEditingGestion(gestion);
                    setShowGestionModal(true);
                  }}
                />
              ))
            )}
          </div>
          {!gestionesError && !isLoadingGestiones && (
            <Pagination
              page={gestionPage}
              totalPages={gestionPagination.totalPages}
              totalItems={gestionPagination.totalItems}
              pageSize={GESTIONES_PAGE_SIZE}
              onPageChange={setGestionPage}
            />
          )}
        </div>
      </div>

      {/* Modal Registrar Nueva Gestión */}
      {showGestionModal && (
        <GestionesFormModal
          clientes={allClientes}
          initialClienteId={id}
          lockCliente
          editingGestion={editingGestion}
          usuario={usuario}
          onClose={() => { setShowGestionModal(false); setEditingGestion(null); }}
          onSubmit={handleGestionSubmit}
        />
      )}

      {/* Modal Editar cliente */}
      {showEditModal && (
        <ClienteFormModal
          initial={cliente}
          clientes={allClientes}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdateCliente}
        />
      )}
    </div>
  );
}
