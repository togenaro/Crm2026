import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import ApiErrorList from '../../../components/ui/ApiErrorList';
import useApiFormSubmission from '../../../hooks/useApiFormSubmission';
import { ESTADOS } from '../clienteHelpers';

export default function ClienteFormModal({ initial = null, clientes = [], onClose, onGuardar }) {
  const isEdit = initial !== null;
  const [erroresCampo, setErroresCampo] = useState({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const { errors: apiErrors, submit, clearErrors } = useApiFormSubmission();

  function obtenerErrorCampo(nombre, valor) {
    if (nombre === 'nombre' && !valor.trim()) return 'El nombre es obligatorio.';
    if (nombre === 'cuit') {
      if (!valor.trim()) return 'El CUIT es obligatorio.';
      const duplicado = clientes.some(cliente =>
        (cliente.cuit || '').trim() === valor.trim()
        && String(cliente.id) !== String(initial?.id),
      );
      if (duplicado) return 'Ya existe un cliente con ese CUIT.';
    }
    if (nombre === 'email' && valor && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
      return 'Formato de email inválido.';
    }
    return '';
  }

  function validarCambio(nombre, valor) {
    setErroresCampo(actuales => {
      if (!intentoEnvio && !Object.hasOwn(actuales, nombre)) return actuales;
      const siguientes = { ...actuales };
      const errorCampo = obtenerErrorCampo(nombre, valor);
      if (errorCampo) siguientes[nombre] = errorCampo;
      else delete siguientes[nombre];
      return siguientes;
    });
  }

  async function guardar(event) {
    event.preventDefault();
    setIntentoEnvio(true);
    const campos = new FormData(event.currentTarget);
    const datos = {
      nombre: campos.get('nombre').trim(),
      cuit: campos.get('cuit').trim(),
      telefono: campos.get('telefono').trim(),
      email: campos.get('email').trim(),
      estado: campos.get('estado'),
      asesor: campos.get('asesor').trim(),
    };
    const errores = Object.fromEntries(
      ['nombre', 'cuit', 'email']
        .map(nombre => [nombre, obtenerErrorCampo(nombre, datos[nombre])])
        .filter(([, mensaje]) => mensaje),
    );
    setErroresCampo(errores);
    if (Object.keys(errores).length > 0) return;

    clearErrors();
    const guardado = await submit(() => onGuardar(datos));
    if (guardado) onClose();
  }

  return (
    <Modal title={isEdit ? 'Editar cliente' : 'Nuevo cliente'} onClose={onClose}>
      <form className="modal-body modal-form" onSubmit={guardar}>
        <ApiErrorList errors={apiErrors} />
        <div className="form-group">
          <label className="form-label" htmlFor="cliente-nombre">Nombre *</label>
          <input className="search-input" id="cliente-nombre" name="nombre" placeholder="Nombre del cliente…" defaultValue={initial?.nombre ?? ''} onChange={event => validarCambio('nombre', event.target.value)} />
          {erroresCampo.nombre && <span className="form-error">{erroresCampo.nombre}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cliente-cuit">CUIT *</label>
          <input className="search-input" id="cliente-cuit" name="cuit" placeholder="30-12345678-9" defaultValue={initial?.cuit ?? ''} onChange={event => validarCambio('cuit', event.target.value)} />
          {erroresCampo.cuit && <span className="form-error">{erroresCampo.cuit}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cliente-telefono">Teléfono</label>
          <input className="search-input" id="cliente-telefono" name="telefono" placeholder="+54 9 …" defaultValue={initial?.telefono ?? ''} />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cliente-email">Email</label>
          <input className="search-input" id="cliente-email" name="email" placeholder="contacto@empresa.com" defaultValue={initial?.email ?? ''} onChange={event => validarCambio('email', event.target.value)} />
          {erroresCampo.email && <span className="form-error">{erroresCampo.email}</span>}
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label" htmlFor="cliente-estado">Estado</label>
            <select className="filter-select" id="cliente-estado" name="estado" defaultValue={initial?.estado ?? 'Prospecto'}>
              {ESTADOS.map(estado => <option key={estado}>{estado}</option>)}
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
          <button className="btn btn-primary" type="submit">{isEdit ? 'Guardar cambios' : 'Guardar cliente'}</button>
        </footer>
      </form>
    </Modal>
  );
}
