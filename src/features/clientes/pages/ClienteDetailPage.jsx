import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import {
  IconAlertTriangle,
  IconArrowUpDown,
  IconCalendar,
  IconEdit,
  IconMail,
  IconPhone,
  IconPlus,
  IconStatus,
  IconTrendingUp,
  IconUser,
} from '../../../components/ui/Icons';
import GestionCard from '../../gestiones/components/GestionCard';
import GestionesFormModal from '../../gestiones/components/GestionesFormModal';
import ClienteFormModal from '../components/ClienteFormModal';
import Pagination from '../../../components/ui/Pagination';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { badgeClass, isOverdue } from '../clienteHelpers';
import { obtenerCliente, actualizarCliente } from '../services/clienteService';
import { crearGestion, actualizarGestion, listarGestionesPorCliente } from '../../gestiones/services/gestionService';
import { formatDate } from '../../../utils/helpers';
import { sortGestionesByDate } from '../../gestiones/gestionHelpers';

const TAMANO_PAGINA_GESTIONES = 5;

export default function ClienteDetailPage() {
  const { clienteId } = useParams();
  const location = useLocation();
  const [cliente, setCliente] = useState(null);
  const [gestiones, setGestiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoGestiones, setCargandoGestiones] = useState(true);
  const [errorCliente, setErrorCliente] = useState('');
  const [errorGestiones, setErrorGestiones] = useState('');
  const [mostrarModalGestion, setMostrarModalGestion] = useState(false);
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [gestionAEditar, setGestionAEditar] = useState(null);
  const [sortDir, setSortDir] = useState('desc');
  const [paginaGestiones, setPaginaGestiones] = useState(1);
  const idCargado = useRef(null);
  const { usuario } = useAuth();
  const { showSuccess } = useToast();
  const volverAGestiones = location.state?.from === '/gestiones';

  const loadData = useCallback(async () => {
    const nuevoCliente = idCargado.current !== clienteId;
    if (nuevoCliente) {
      idCargado.current = clienteId;
      setCliente(null);
      setCargando(true);
      setPaginaGestiones(1);
    }
    setErrorCliente('');
    setErrorGestiones('');
    setCargandoGestiones(true);

    let clienteActual;
    try {
      clienteActual = await obtenerCliente(clienteId);
      setCliente(clienteActual);
      setCargando(false);
    } catch {
      setCliente(null);
      setErrorCliente('No se pudieron cargar los datos del cliente.');
      setCargando(false);
      setCargandoGestiones(false);
      return;
    }

    try {
      setGestiones(await listarGestionesPorCliente(clienteId, clienteActual));
    } catch {
      setGestiones([]);
      setErrorGestiones('No se pudieron cargar las gestiones de este cliente.');
    } finally {
      setCargandoGestiones(false);
    }
  }, [clienteId]);

  useEffect(() => { void loadData(); }, [loadData]);

  async function guardarCliente(datos) {
    await actualizarCliente(cliente.id, datos);
    showSuccess('Cliente actualizado.');
    void loadData();
  }

  async function guardarGestion(datos) {
    if (gestionAEditar) {
      await actualizarGestion(cliente.id, gestionAEditar.id, datos);
      showSuccess('Gestión actualizada.');
    } else {
      await crearGestion(cliente.id, { ...datos, asesor: usuario?.nombre || cliente.asesor });
      showSuccess('Gestión registrada.');
    }
    setGestionAEditar(null);
    setMostrarModalGestion(false);
    void loadData();
  }

  if (errorCliente) return <div className="error-banner">{errorCliente}</div>;
  if (cargando) return <div className="empty-state">Cargando cliente…</div>;
  if (!cliente) return <Navigate to="/clientes" replace />;

  const vencido = isOverdue(cliente.proximoContacto);
  const gestionesOrdenadas = sortGestionesByDate(gestiones, sortDir === 'desc');
  const totalPaginasGestiones = Math.max(1, Math.ceil(gestionesOrdenadas.length / TAMANO_PAGINA_GESTIONES));
  const inicioGestiones = (paginaGestiones - 1) * TAMANO_PAGINA_GESTIONES;
  const gestionesVisibles = gestionesOrdenadas.slice(inicioGestiones, inicioGestiones + TAMANO_PAGINA_GESTIONES);

  return (
    <div className="full-view-container">
      <header className="page-header detail-page-header">
        <div>
          <div className="detail-title-row">
            <h1 className="page-title">{cliente.nombre}</h1>
            <button className="action-btn" type="button" title="Editar cliente" aria-label="Editar cliente" onClick={() => setMostrarModalCliente(true)}>
              <IconEdit />
            </button>
          </div>
          <div className="detail-subtitle">CUIT {cliente.cuit}</div>
          <div className="detail-subtitle detail-contact"><IconMail /> {cliente.email || '—'}</div>
          <div className="detail-subtitle detail-contact"><IconPhone /> {cliente.telefono}</div>
        </div>
        <Link className="btn-back-discrete" to={volverAGestiones ? '/gestiones' : '/clientes'}>
          ← Volver a {volverAGestiones ? 'Gestiones' : 'Clientes'}
        </Link>
      </header>

      <section className="full-view-meta-card" aria-label="Datos actuales del cliente">
        <div className="full-meta-item">
          <span className="full-meta-label"><IconStatus /> Estado actual</span>
          <span className="full-meta-value">
            <span className={`badge ${badgeClass(cliente.estado)}`}>{cliente.estado}</span>
          </span>
        </div>
        <div className="full-meta-item">
          <span className="full-meta-label"><IconUser /> Asesor asignado</span>
          <span className="full-meta-value">{cliente.asesor}</span>
        </div>
        <div className="full-meta-item">
          <span className="full-meta-label"><IconCalendar /> Próximo contacto</span>
          <span className={`full-meta-value${vencido ? ' overdue' : ''}`}>
            {vencido && <IconAlertTriangle />}{formatDate(cliente.proximoContacto)}
          </span>
        </div>
        <div className="full-meta-item">
          <span className="full-meta-label"><IconTrendingUp /> Última actualización</span>
          <span className="full-meta-value">{formatDate(cliente.fechaActualizacion)}</span>
        </div>
      </section>

      <section className="list-container detail-history" aria-label="Historial de gestiones">
        <div className="table-info-bar">
          <div className="table-info-bar-left">
            <strong>
              Historial de Gestiones ({errorGestiones ? '—' : gestiones.length})
            </strong>
          </div>
          <div className="table-info-bar-right">
            <button
              className="btn btn-outline btn-sm"
              type="button"
              title="Cambiar orden por fecha"
              onClick={() => {
                setSortDir(actual => actual === 'desc' ? 'asc' : 'desc');
                setPaginaGestiones(1);
              }}
            >
              <IconArrowUpDown /> {sortDir === 'desc' ? 'Recientes' : 'Antiguas'}
            </button>
            <button className="btn btn-primary btn-sm" type="button" onClick={() => {
              setGestionAEditar(null);
              setMostrarModalGestion(true);
            }}>
              <IconPlus /> Nueva gestión
            </button>
          </div>
        </div>
        <div className="full-history-list">
          {errorGestiones || cargandoGestiones || gestionesVisibles.length === 0 ? (
            <div className={errorGestiones ? 'error-banner' : 'empty-state'}>
              <p>{errorGestiones ? 'No se pudieron cargar las gestiones de este cliente.' : cargandoGestiones ? 'Cargando gestiones…' : 'No hay gestiones registradas para este cliente.'}</p>
            </div>
          ) : gestionesVisibles.map(gestion => (
            <GestionCard
              key={gestion.id}
              gestion={gestion}
              showCliente={false}
              onClickGestion={seleccionada => setGestionAEditar(seleccionada)}
            />
          ))}
        </div>
        {!errorGestiones && !cargandoGestiones && (
          <Pagination
            page={paginaGestiones}
            totalPages={totalPaginasGestiones}
            totalItems={gestiones.length}
            pageSize={TAMANO_PAGINA_GESTIONES}
            onPageChange={setPaginaGestiones}
          />
        )}
      </section>
      {mostrarModalGestion && (
        <GestionesFormModal
          cliente={cliente}
          editingGestion={gestionAEditar}
          onClose={() => {
            setGestionAEditar(null);
            setMostrarModalGestion(false);
          }}
          onGuardar={guardarGestion}
        />
      )}
      {gestionAEditar && !mostrarModalGestion && (
        <GestionesFormModal
          cliente={cliente}
          editingGestion={gestionAEditar}
          onClose={() => setGestionAEditar(null)}
          onGuardar={guardarGestion}
        />
      )}
      {mostrarModalCliente && (
        <ClienteFormModal clientes={[cliente]} initial={cliente} onClose={() => setMostrarModalCliente(false)} onGuardar={guardarCliente} />
      )}
    </div>
  );
}
