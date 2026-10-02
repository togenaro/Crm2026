import { IconCalendar } from '../../../components/ui/Icons';

function formatDate(date) {
  if (!date) return '—';
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  const formattedDate = new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(date);
  const formattedTime = new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(date);

  return `${formattedDate} · ${formattedTime}`;
}

function statusClass(status) {
  const classes = {
    Prospecto: 'badge-prospecto',
    Contactado: 'badge-contactado',
    Interesado: 'badge-interesado',
    NoInteresado: 'badge-no_interesado',
    Cliente: 'badge-cliente',
  };
  return classes[status] || 'badge-prospecto';
}

export default function GestionCard({ gestion, showCliente = true }) {
  return (
    <article className="gestion-card">
      <header className="gestion-card-header">
        <span className="timeline-tipo">{gestion.tipoContacto}</span>
        <span className="gestion-card-date">
          <IconCalendar /> {formatDateTime(gestion.fechaGestion)}
        </span>
      </header>

      {showCliente && (
        <div className="gestion-card-cliente">
          <strong>{gestion.clienteNombre}</strong>
          <span>CUIT {gestion.clienteCuit}</span>
        </div>
      )}

      <div className="gestion-card-body">
        <p>{gestion.comentario}</p>
      </div>

      {gestion.proximoContacto && (
        <div className="timeline-next">
          <IconCalendar /> Próximo contacto: {formatDate(gestion.proximoContacto)}
        </div>
      )}

      <footer className="gestion-card-footer">
        <span className="gestion-card-asesor">
          Registrado por: <strong>{gestion.asesor}</strong>
        </span>
        <span className="gestion-card-estado">
          Estado resultante:
          <span className={`badge ${statusClass(gestion.estadoResultante)}`}>
            {gestion.estadoResultante === 'NoInteresado' ? 'No interesado' : gestion.estadoResultante}
          </span>
        </span>
      </footer>
    </article>
  );
}
