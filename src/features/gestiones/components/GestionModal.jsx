import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import ApiErrorList from '../../../components/ui/ApiErrorList';

const estados = ['Prospecto', 'Contactado', 'Interesado', 'No interesado', 'Cliente'];

export default function GestionModal({ cliente = null, clientes = [], editingGestion = null, onClose, onGuardar }) {
  const [clienteId, setClienteId] = useState(editingGestion?.clienteId ?? cliente?.id ?? '');
  const [estado, setEstado] = useState(editingGestion?.estadoResultante ?? cliente?.estado ?? estados[0]);
  const [proximoContacto, setProximoContacto] = useState(editingGestion?.proximoContacto ?? cliente?.proximoContacto ?? '');
  const [error, setError] = useState('');
  const [erroresCampo, setErroresCampo] = useState({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const now = new Date();
  const fechaActual = now.toISOString().split('T')[0];
  const horaActual = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const clienteSeleccionado = cliente || clientes.find(item => String(item.id) === String(clienteId));

  function obtenerErrorCampo(nombre, valor) {
    if (nombre === 'clienteId' && !valor) return 'Seleccioná un cliente.';
    if (nombre === 'fechaGestion' && !valor) return 'La fecha de la gestión es obligatoria.';
    if (nombre === 'horaGestion' && !valor) return 'La hora de la gestión es obligatoria.';
    if (nombre === 'comentario' && !valor.trim()) return 'El comentario es obligatorio.';
    if (nombre === 'estadoResultante' && !valor) return 'Seleccioná el nuevo estado del cliente.';
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

  function seleccionarCliente(event) {
    const id = event.target.value;
    const seleccionado = clientes.find(item => String(item.id) === String(id));
    setClienteId(id);
    setEstado(seleccionado?.estado ?? estados[0]);
    setProximoContacto(seleccionado?.proximoContacto ?? '');
    validarCambio('clienteId', id);
  }

  async function guardarGestion(event) {
    event.preventDefault();
    setIntentoEnvio(true);
    const campos = new FormData(event.currentTarget);
    const datos = {
      clienteId: cliente?.id ?? clienteId,
      tipoContacto: campos.get('tipoContacto'),
      fechaGestion: campos.get('fechaGestion'),
      horaGestion: campos.get('horaGestion'),
      comentario: campos.get('comentario').trim(),
      estadoResultante: campos.get('estadoResultante'),
      proximoContacto: campos.get('proximoContacto') || '',
    };
    const errores = Object.fromEntries(
      ['clienteId', 'fechaGestion', 'horaGestion', 'comentario', 'estadoResultante']
        .map(nombre => [nombre, obtenerErrorCampo(nombre, datos[nombre])])
        .filter(([, mensaje]) => mensaje),
    );
    setErroresCampo(errores);
    if (Object.keys(errores).length > 0) return;

    setError('');
    try {
      await onGuardar(datos);
    } catch (errorGuardado) {
      setError(errorGuardado.message);
    }
  }

  return (
    <Modal
      title={editingGestion ? 'Editar gestión' : 'Nueva gestión'}
      subtitle={clienteSeleccionado && <>Cliente: <strong>{clienteSeleccionado.nombre}</strong></>}
      onClose={onClose}
    >
        <form className="modal-body modal-form" onSubmit={guardarGestion}>
          <ApiErrorList errors={error ? [error] : []} />
          {!cliente && !editingGestion && (
            <div className="form-group">
              <label className="form-label" htmlFor="gestion-cliente">Cliente *</label>
              <select className="filter-select" id="gestion-cliente" value={clienteId} onChange={seleccionarCliente}>
                <option value="">Seleccionar cliente…</option>
                {clientes.map(item => (
                  <option key={item.id} value={item.id}>{item.nombre} · CUIT {item.cuit}</option>
                ))}
              </select>
              {erroresCampo.clienteId && <span className="form-error">{erroresCampo.clienteId}</span>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="gestion-tipo">Tipo de gestión</label>
              <select className="filter-select" id="gestion-tipo" name="tipoContacto" defaultValue={editingGestion?.tipoContacto ?? 'Llamada'}>
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
              <input className="search-input" id="gestion-fecha" name="fechaGestion" type="date" defaultValue={editingGestion?.fechaGestion?.slice(0, 10) ?? fechaActual} onChange={event => validarCambio('fechaGestion', event.target.value)} />
              {erroresCampo.fechaGestion && <span className="form-error">{erroresCampo.fechaGestion}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="gestion-hora">Hora de la gestión *</label>
              <input className="search-input" id="gestion-hora" name="horaGestion" type="time" defaultValue={editingGestion?.fechaGestion?.slice(11, 16) ?? horaActual} onChange={event => validarCambio('horaGestion', event.target.value)} />
              {erroresCampo.horaGestion && <span className="form-error">{erroresCampo.horaGestion}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="gestion-comentario">Observaciones / Detalles *</label>
            <textarea className="search-input" id="gestion-comentario" name="comentario" placeholder="Detalles de la interacción realizada…" defaultValue={editingGestion?.comentario ?? ''} onChange={event => validarCambio('comentario', event.target.value)} />
            {erroresCampo.comentario && <span className="form-error">{erroresCampo.comentario}</span>}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="gestion-estado">Nuevo Estado del Cliente *</label>
              <select className="filter-select" id="gestion-estado" name="estadoResultante" value={estado} onChange={event => {
                setEstado(event.target.value);
                validarCambio('estadoResultante', event.target.value);
              }}>
                <option value="">Seleccionar estado…</option>
                {estados.map(item => <option key={item}>{item}</option>)}
              </select>
              {erroresCampo.estadoResultante && <span className="form-error">{erroresCampo.estadoResultante}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="gestion-proximo-contacto">Próxima fecha de contacto</label>
              <input className="search-input" id="gestion-proximo-contacto" name="proximoContacto" type="date" value={proximoContacto} onChange={event => setProximoContacto(event.target.value)} />
            </div>
          </div>

          <footer className="modal-form-actions">
            <span className="form-required-legend">* Campos obligatorios</span>
            <button className="btn btn-outline" type="button" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" type="submit">{editingGestion ? 'Guardar cambios' : 'Guardar gestión'}</button>
          </footer>
        </form>
    </Modal>
  );
}
