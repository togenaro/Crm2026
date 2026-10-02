import { useState } from 'react';
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
import { clienteDetalleDemo } from '../data/clienteDetalleDemo';

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

export default function ClienteDetailPage() {
  const [mostrarModalGestion, setMostrarModalGestion] = useState(false);
  const cliente = clienteDetalleDemo;
  const vencido = cliente.proximoContacto < '2026-10-02';

  return (
    <div className="full-view-container">
      <header className="page-header detail-page-header">
        <div>
          <div className="detail-title-row">
            <h1 className="page-title">{cliente.nombre}</h1>
            <button className="action-btn" type="button" title="Editar cliente" aria-label="Editar cliente">
              <IconEdit />
            </button>
          </div>
          <div className="detail-subtitle">CUIT {cliente.cuit}</div>
          <div className="detail-subtitle detail-contact"><IconMail /> {cliente.email || '—'}</div>
          <div className="detail-subtitle detail-contact"><IconPhone /> {cliente.telefono}</div>
        </div>
        <button className="btn-back-discrete" type="button">← Volver a Clientes</button>
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
            <strong>Historial de Gestiones ({cliente.gestiones.length})</strong>
          </div>
          <div className="table-info-bar-right">
            <button className="btn btn-outline btn-sm" type="button" title="Cambiar orden por fecha">
              <IconArrowUpDown /> Recientes
            </button>
            <button className="btn btn-primary btn-sm" type="button" onClick={() => setMostrarModalGestion(true)}>
              <IconPlus /> Nueva gestión
            </button>
          </div>
        </div>
        <div className="full-history-list">
          {cliente.gestiones.map(gestion => (
            <GestionCard key={gestion.id} gestion={gestion} showCliente={false} />
          ))}
        </div>
      </section>
      {mostrarModalGestion && (
        <GestionModal cliente={cliente} onClose={() => setMostrarModalGestion(false)} />
      )}
    </div>
  );
}
