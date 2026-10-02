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
  IconSearch,
  IconStatus,
  IconTrendingUp,
  IconUser,
} from '../../../components/ui/Icons';
import GestionCard from '../../gestiones/components/GestionCard';
import GestionModal from '../../gestiones/components/GestionModal';
import ClienteModal from '../components/ClienteModal';

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

export default function ClienteDetailPage({ clientes, gestiones, onAgregarGestion }) {
  const { clienteId } = useParams();
  const location = useLocation();
  const [mostrarModalGestion, setMostrarModalGestion] = useState(false);
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [busquedaGestiones, setBusquedaGestiones] = useState('');
  const [sortDir, setSortDir] = useState('desc');
  const clienteListado = clientes.find(cliente => String(cliente.id) === String(clienteId));
  const volverAGestiones = location.state?.from === '/gestiones';

  if (!clienteListado) return <Navigate to="/clientes" replace />;

  const cliente = {
    ...clienteListado,
    gestiones: gestiones.filter(gestion => gestion.clienteCuit === clienteListado.cuit),
  };
  const hoy = new Date().toISOString().slice(0, 10);
  const vencido = cliente.proximoContacto < hoy;
  const terminoBusquedaGestiones = busquedaGestiones.trim().toLocaleLowerCase('es');
  const gestionesFiltradas = cliente.gestiones
    .filter(gestion => !terminoBusquedaGestiones || [
      gestion.tipoContacto,
      gestion.comentario,
      gestion.asesor,
    ].some(valor => valor?.toLocaleLowerCase('es').includes(terminoBusquedaGestiones)))
    .sort((primera, segunda) => {
      const fechaPrimera = new Date(primera.fechaGestion).getTime();
      const fechaSegunda = new Date(segunda.fechaGestion).getTime();

      return sortDir === 'desc' ? fechaSegunda - fechaPrimera : fechaPrimera - fechaSegunda;
    });

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
              Historial de Gestiones ({terminoBusquedaGestiones ? `${gestionesFiltradas.length} de ` : ''}{cliente.gestiones.length})
            </strong>
          </div>
          <div className="table-info-bar-right">
            <label className="search-input-wrap">
              <IconSearch />
              <input
                className="search-input"
                type="search"
                placeholder="Buscar en el historial…"
                aria-label="Buscar en el historial de gestiones"
                value={busquedaGestiones}
                onChange={event => setBusquedaGestiones(event.target.value)}
              />
            </label>
            <button
              className="btn btn-outline btn-sm"
              type="button"
              title="Cambiar orden por fecha"
              onClick={() => setSortDir(actual => actual === 'desc' ? 'asc' : 'desc')}
            >
              <IconArrowUpDown /> {sortDir === 'desc' ? 'Recientes' : 'Antiguas'}
            </button>
            <button className="btn btn-primary btn-sm" type="button" onClick={() => setMostrarModalGestion(true)}>
              <IconPlus /> Nueva gestión
            </button>
          </div>
        </div>
        <div className="full-history-list">
          {gestionesFiltradas.length === 0 ? (
            <p className="pagination-info">No se encontraron gestiones con esas palabras.</p>
          ) : gestionesFiltradas.map(gestion => (
            <GestionCard key={gestion.id} gestion={gestion} showCliente={false} />
          ))}
        </div>
      </section>
      {mostrarModalGestion && (
        <GestionModal
          cliente={cliente}
          onClose={() => setMostrarModalGestion(false)}
          onGuardar={datos => {
            onAgregarGestion(datos);
            setMostrarModalGestion(false);
          }}
        />
      )}
      {mostrarModalCliente && (
        <ClienteModal initial={cliente} onClose={() => setMostrarModalCliente(false)} />
      )}
    </div>
  );
}
