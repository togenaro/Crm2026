import { useState } from 'react';
import { IconX } from '../../../components/ui/Icons';

const estados = ['Prospecto', 'Contactado', 'Interesado', 'No interesado', 'Cliente'];

export default function GestionModal({ cliente, onClose }) {
  const [estado, setEstado] = useState(cliente.estado);
  const now = new Date();
  const fechaActual = now.toISOString().split('T')[0];
  const horaActual = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gestion-modal-title"
        onClick={event => event.stopPropagation()}
      >
        <header className="modal-header">
          <div className="modal-header-left">
            <h2 className="modal-title" id="gestion-modal-title">Nueva gestión</h2>
            <span className="modal-subtitle">Cliente: <strong>{cliente.nombre}</strong></span>
          </div>
          <button className="panel-close-btn" type="button" title="Cerrar ventana" aria-label="Cerrar ventana" onClick={onClose}>
            <IconX />
          </button>
        </header>

        <form className="modal-body modal-form" onSubmit={event => event.preventDefault()}>
          <div className="form-group">
            <label className="form-label" htmlFor="gestion-tipo">Tipo de gestión</label>
            <select className="filter-select" id="gestion-tipo" defaultValue="Llamada">
              <option>Llamada</option>
              <option value="Correo">Correo / Email</option>
              <option>Reunión</option>
              <option>WhatsApp</option>
              <option>Otro</option>
            </select>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="gestion-fecha">Fecha de la gestión *</label>
              <input className="search-input" id="gestion-fecha" type="date" defaultValue={fechaActual} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="gestion-hora">Hora de la gestión *</label>
              <input className="search-input" id="gestion-hora" type="time" defaultValue={horaActual} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="gestion-comentario">Observaciones / Detalles *</label>
            <textarea className="search-input" id="gestion-comentario" placeholder="Detalles de la interacción realizada…" />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="gestion-estado">Nuevo Estado del Cliente *</label>
              <select className="filter-select" id="gestion-estado" value={estado} onChange={event => setEstado(event.target.value)}>
                {estados.map(item => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="gestion-proximo-contacto">Próxima fecha de contacto</label>
              <input className="search-input" id="gestion-proximo-contacto" type="date" defaultValue={cliente.proximoContacto} />
            </div>
          </div>

          <footer className="modal-form-actions">
            <span className="form-required-legend">* Campos obligatorios</span>
            <button className="btn btn-outline" type="button" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" type="submit">Guardar gestión</button>
          </footer>
        </form>
      </section>
    </div>
  );
}
