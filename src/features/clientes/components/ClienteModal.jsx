import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import ApiErrorList from '../../../components/ui/ApiErrorList';

const estados = ['Prospecto', 'Contactado', 'Interesado', 'No interesado', 'Cliente'];

export default function ClienteModal({ initial = null, onClose, onGuardar }) {
  const isEdit = initial !== null;
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [erroresCampo, setErroresCampo] = useState({});

  async function guardar(event) {
    event.preventDefault();
    const campos = new FormData(event.currentTarget);
    const datos = {
      nombre: campos.get('nombre').trim(),
      cuit: campos.get('cuit').trim(),
      telefono: campos.get('telefono').trim(),
      email: campos.get('email').trim(),
      estado: campos.get('estado'),
      asesor: campos.get('asesor').trim(),
    };
    const errores = {};
    if (!datos.nombre) errores.nombre = 'El nombre es obligatorio.';
    if (!datos.cuit) errores.cuit = 'El CUIT es obligatorio.';
    if (datos.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
      errores.email = 'Formato de email inválido.';
    }
    setErroresCampo(errores);
    if (Object.keys(errores).length > 0) return;

    setGuardando(true);
    setError('');

    try {
      await onGuardar(datos);
      onClose();
    } catch (errorGuardado) {
      setError(errorGuardado.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal title={isEdit ? 'Editar cliente' : 'Nuevo cliente'} onClose={onClose}>
      <form className="modal-body modal-form" onSubmit={guardar}>
        <ApiErrorList errors={error ? [error] : []} />
        <div className="form-group">
          <label className="form-label" htmlFor="cliente-nombre">Nombre *</label>
          <input className="search-input" id="cliente-nombre" name="nombre" placeholder="Nombre del cliente…" defaultValue={initial?.nombre ?? ''} />
          {erroresCampo.nombre && <span className="form-error">{erroresCampo.nombre}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cliente-cuit">CUIT *</label>
          <input className="search-input" id="cliente-cuit" name="cuit" placeholder="30-12345678-9" defaultValue={initial?.cuit ?? ''} />
          {erroresCampo.cuit && <span className="form-error">{erroresCampo.cuit}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cliente-telefono">Teléfono</label>
          <input className="search-input" id="cliente-telefono" name="telefono" placeholder="+54 9 …" defaultValue={initial?.telefono ?? ''} />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cliente-email">Email</label>
          <input className="search-input" id="cliente-email" name="email" placeholder="contacto@empresa.com" defaultValue={initial?.email ?? ''} />
          {erroresCampo.email && <span className="form-error">{erroresCampo.email}</span>}
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label" htmlFor="cliente-estado">Estado</label>
            <select className="filter-select" id="cliente-estado" name="estado" defaultValue={initial?.estado ?? 'Prospecto'}>
              {estados.map(estado => <option key={estado}>{estado}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cliente-asesor">Asesor</label>
            <input className="search-input" id="cliente-asesor" name="asesor" placeholder="Asesor asignado…" defaultValue={initial?.asesor ?? ''} />
          </div>
        </div>

        <footer className="modal-form-actions">
          <span className="form-required-legend">* Campos obligatorios</span>
          <button className="btn btn-outline" type="button" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" type="submit" disabled={guardando}>{guardando ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Guardar cliente'}</button>
        </footer>
      </form>
    </Modal>
  );
}
