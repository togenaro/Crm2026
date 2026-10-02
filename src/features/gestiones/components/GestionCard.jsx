import { IconCalendar } from '../../../components/ui/Icons';
import { Link } from 'react-router-dom';
import { badgeClass } from '../../clientes/clienteHelpers';
import { formatDate, formatDateTime } from '../../../utils/helpers';

export default function GestionCard({ gestion, showCliente = true, clienteId, onClickGestion }) {
  return (
    <article
      className="gestion-card"
      style={{ cursor: onClickGestion ? 'pointer' : 'default' }}
      onClick={() => onClickGestion?.(gestion)}
      onKeyDown={event => {
        if (onClickGestion && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onClickGestion(gestion);
        }
      }}
      role={onClickGestion ? 'button' : undefined}
      tabIndex={onClickGestion ? 0 : undefined}
    >
      <header className="gestion-card-header">
        <span className="timeline-tipo">{gestion.tipoContacto}</span>
        <span className="gestion-card-date">
          <IconCalendar /> {formatDateTime(gestion.fechaGestion)}
        </span>
      </header>

      {showCliente && (
        <div className="gestion-card-cliente">
          <strong>
            {clienteId ? (
              <Link className="gestion-card-cliente-link" to={`/clientes/${clienteId}`} state={{ from: '/gestiones' }} onClick={event => event.stopPropagation()}>
                {gestion.clienteNombre}
              </Link>
            ) : gestion.clienteNombre}
          </strong>
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
          <span className={`badge ${badgeClass(gestion.estadoResultante)}`}>
            {gestion.estadoResultante === 'NoInteresado' ? 'No interesado' : gestion.estadoResultante}
          </span>
        </span>
      </footer>
    </article>
  );
}
