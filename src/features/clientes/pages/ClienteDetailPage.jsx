import { useState } from 'react';
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
import GestionModal from '../../gestiones/components/GestionModal';
import ClienteModal from '../components/ClienteModal';
import Pagination from '../../../components/ui/Pagination';

const TAMANO_PAGINA_GESTIONES = 5;

function formatDate(date) {
  if (!date) return '—';
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

function statusClass(status) {
  const classes = {
    Prospecto: 'badge-prospecto',
    Contactado: 'badge-contactado',
    Interesado: 'badge-interesado',
    NoInteresado: 'badge-no_interesado',
    'No interesado': 'badge-no_interesado',
    Cliente: 'badge-cliente',
  };
  return classes[status] || 'badge-prospecto';
}

export default function ClienteDetailPage({ clientes, gestiones, cargando, cargandoGestiones, errorCliente, errorGestiones, onGuardarCliente, onAgregarGestion, onEditarGestion }) {
  const { clienteId } = useParams();
  const location = useLocation();
  const [mostrarModalGestion, setMostrarModalGestion] = useState(false);
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [gestionAEditar, setGestionAEditar] = useState(null);
  const [sortDir, setSortDir] = useState('desc');
  const [paginaGestiones, setPaginaGestiones] = useState(1);
  const clienteListado = clientes.find(cliente => String(cliente.id) === String(clienteId));
  const volverAGestiones = location.state?.from === '/gestiones';

  if (errorCliente) return <div className="error-banner">No se pudieron cargar los datos del cliente.</div>;
  if (cargando) return <div className="empty-state">Cargando cliente…</div>;
  if (!clienteListado) return <Navigate to="/clientes" replace />;

  const cliente = {
    ...clienteListado,
    gestiones: gestiones.filter(gestion => String(gestion.clienteId) === String(clienteListado.id)),
  };
  const hoy = new Date().toISOString().slice(0, 10);
  const vencido = cliente.proximoContacto < hoy;
  const gestionesOrdenadas = [...cliente.gestiones].sort((primera, segunda) => {
      const fechaPrimera = new Date(primera.fechaGestion).getTime();
      const fechaSegunda = new Date(segunda.fechaGestion).getTime();

      return sortDir === 'desc' ? fechaSegunda - fechaPrimera : fechaPrimera - fechaSegunda;
    });
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
            <span className={`badge ${statusClass(cliente.estado)}`}>{cliente.estado}</span>
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
              Historial de Gestiones ({errorGestiones ? '—' : cliente.gestiones.length})
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
            totalItems={cliente.gestiones.length}
            pageSize={TAMANO_PAGINA_GESTIONES}
            onPageChange={setPaginaGestiones}
          />
        )}
      </section>
      {mostrarModalGestion && (
        <GestionModal
          cliente={cliente}
          editingGestion={gestionAEditar}
          onClose={() => {
            setGestionAEditar(null);
            setMostrarModalGestion(false);
          }}
          onGuardar={async datos => {
            if (gestionAEditar) await onEditarGestion({ ...datos, gestionId: gestionAEditar.id });
            else await onAgregarGestion(datos);
            setGestionAEditar(null);
            setMostrarModalGestion(false);
          }}
        />
      )}
      {gestionAEditar && !mostrarModalGestion && (
        <GestionModal
          cliente={cliente}
          editingGestion={gestionAEditar}
          onClose={() => setGestionAEditar(null)}
          onGuardar={async datos => {
            await onEditarGestion({ ...datos, gestionId: gestionAEditar.id });
            setGestionAEditar(null);
          }}
        />
      )}
      {mostrarModalCliente && (
        <ClienteModal initial={cliente} onClose={() => setMostrarModalCliente(false)} onGuardar={datos => onGuardarCliente(datos, cliente.id)} />
      )}
    </div>
  );
}
