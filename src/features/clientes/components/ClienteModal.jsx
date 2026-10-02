import Modal from '../../../components/ui/Modal';

const estados = ['Prospecto', 'Contactado', 'Interesado', 'No interesado', 'Cliente'];

export default function ClienteModal({ onClose }) {
  return (
    <Modal title="Nuevo cliente" onClose={onClose}>
      <form className="modal-body modal-form" onSubmit={event => event.preventDefault()}>
        <div className="form-group">
          <label className="form-label" htmlFor="cliente-nombre">Nombre *</label>
          <input className="search-input" id="cliente-nombre" placeholder="Nombre del cliente…" required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cliente-cuit">CUIT *</label>
          <input className="search-input" id="cliente-cuit" placeholder="30-12345678-9" required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cliente-telefono">Teléfono</label>
          <input className="search-input" id="cliente-telefono" placeholder="+54 9 …" />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cliente-email">Email</label>
          <input className="search-input" id="cliente-email" placeholder="contacto@empresa.com" />
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label" htmlFor="cliente-estado">Estado</label>
            <select className="filter-select" id="cliente-estado" defaultValue="Prospecto">
              {estados.map(estado => <option key={estado}>{estado}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cliente-asesor">Asesor</label>
            <input className="search-input" id="cliente-asesor" placeholder="Asesor asignado…" />
          </div>
        </div>

        <footer className="modal-form-actions">
          <span className="form-required-legend">* Campos obligatorios</span>
          <button className="btn btn-outline" type="button" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" type="submit">Guardar cliente</button>
        </footer>
      </form>
    </Modal>
  );
}
