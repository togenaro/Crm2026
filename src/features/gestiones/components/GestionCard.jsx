import { IconCalendar } from '../../../components/ui/Icons';
import { formatDate, formatDateTime } from '../../../utils/helpers';
import { badgeClass } from '../../clientes/clienteHelpers';

export default function GestionCard({ gestion, cliente, onClickCliente, onClickGestion, showCliente = true }) {
  const tipoValue = gestion.tipoContacto || gestion.tipo || 'Gestión';
  const obs = gestion.comentario || gestion.observacion || '(Sin detalle)';
  const fecha = gestion.fechaGestion || gestion.fecha;
  const asesor = gestion.asesor || cliente?.asesor || 'Asesor';
  const estadoResultante = gestion.estadoResultante || null;

  return (
    <div
      className="gestion-card"
      style={{ cursor: onClickGestion || onClickCliente ? 'pointer' : 'default' }}
      onClick={() => {
        if (onClickGestion) onClickGestion(gestion);
        else onClickCliente?.(cliente, gestion.clienteId);
      }}
    >
      <div className="gestion-card-header">
        <div className="gestion-card-header-left">
          <span className="timeline-tipo">{tipoValue}</span>
        </div>
        <div className="gestion-card-header-right">
          <span className="gestion-card-date">
            <IconCalendar /> {formatDateTime(fecha, gestion.horaGestion)}
          </span>
        </div>
      </div>

      {showCliente && (cliente || gestion.clienteNombre) && (
        <div
          className="gestion-card-cliente"
          role={onClickCliente ? 'link' : undefined}
          tabIndex={onClickCliente ? 0 : undefined}
          onClick={onClickGestion ? e => {
            e.stopPropagation();
            onClickCliente?.(cliente, gestion.clienteId);
          } : undefined}
          onKeyDown={onClickGestion ? e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              e.preventDefault();
              onClickCliente?.(cliente, gestion.clienteId);
            }
          } : undefined}
        >
          <strong>{cliente?.nombre || gestion.clienteNombre}</strong>
          {cliente?.cuit && <span>CUIT {cliente.cuit}</span>}
        </div>
      )}

      <div className="gestion-card-body">
        <p>{obs}</p>
      </div>

      {gestion.proximoContacto && (
        <div className="timeline-next">
          <IconCalendar /> Próximo contacto: {formatDate(gestion.proximoContacto)}
        </div>
      )}

      <div className="gestion-card-footer">
        <span className="gestion-card-asesor">
          Registrado por: <strong>{asesor}</strong>
        </span>
        {estadoResultante && (
          <span className="gestion-card-estado">
            Estado resultante: <span className={`badge ${badgeClass(estadoResultante)}`}>{estadoResultante}</span>
          </span>
        )}
      </div>
    </div>
  );
}
