import { IconX } from './Icons';

export default function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={event => event.stopPropagation()}
      >
        <header className="modal-header">
          <div className="modal-header-left">
            <div>
              <h3 className="modal-title" id="modal-title">{title}</h3>
              {subtitle && <span className="modal-subtitle">{subtitle}</span>}
            </div>
          </div>
          <button className="panel-close-btn" type="button" title="Cerrar ventana" aria-label="Cerrar ventana" onClick={onClose}>
            <IconX />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
