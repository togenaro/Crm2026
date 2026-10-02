import { IconX } from './Icons';

export default function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={event => event.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <div>
              <h3 className="modal-title">{title}</h3>
              {subtitle && <span className="modal-subtitle">{subtitle}</span>}
            </div>
          </div>
          <button type="button" className="panel-close-btn" onClick={onClose} title="Cerrar ventana">
            <IconX />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
