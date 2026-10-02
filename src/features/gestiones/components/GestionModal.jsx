import { useState } from 'react';
import Modal from '../../../components/ui/Modal';

const estados = ['Prospecto', 'Contactado', 'Interesado', 'No interesado', 'Cliente'];

export default function GestionModal({ cliente = null, clientes = [], onClose, onGuardar }) {
  const [clienteId, setClienteId] = useState(cliente?.id ?? '');
  const [estado, setEstado] = useState(cliente?.estado ?? estados[0]);
  const [proximoContacto, setProximoContacto] = useState(cliente?.proximoContacto ?? '');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const now = new Date();
  const fechaActual = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  const horaActual = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const clienteSeleccionado = cliente || clientes.find(item => String(item.id) === String(clienteId));

  function seleccionarCliente(event) {
    const id = event.target.value;
    const seleccionado = clientes.find(item => String(item.id) === String(id));
    setClienteId(id);
    setEstado(seleccionado?.estado ?? estados[0]);
    setProximoContacto(seleccionado?.proximoContacto ?? '');
  }

  async function guardarGestion(event) {
    event.preventDefault();
    const campos = new FormData(event.currentTarget);

    setGuardando(true);
    setError('');
    try {
      await onGuardar({
        clienteId: cliente?.id ?? clienteId,
        tipoContacto: campos.get('tipoContacto'),
        fechaGestion: campos.get('fechaGestion'),
        horaGestion: campos.get('horaGestion'),
        comentario: campos.get('comentario'),
        estadoResultante: campos.get('estadoResultante'),
        proximoContacto: campos.get('proximoContacto') || '',
      });
    } catch (errorGuardado) {
      setError(errorGuardado.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal
      title="Nueva gestión"
      subtitle={clienteSeleccionado && <>Cliente: <strong>{clienteSeleccionado.nombre}</strong></>}
      onClose={onClose}
    >
        <form className="modal-body modal-form" onSubmit={guardarGestion}>
          {!cliente && (
            <div className="form-group">
              <label className="form-label" htmlFor="gestion-cliente">Cliente *</label>
              <select className="filter-select" id="gestion-cliente" value={clienteId} onChange={seleccionarCliente} required>
                <option value="">Seleccionar cliente…</option>
                {clientes.map(item => (
                  <option key={item.id} value={item.id}>{item.nombre} · CUIT {item.cuit}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="gestion-tipo">Tipo de gestión</label>
              <select className="filter-select" id="gestion-tipo" name="tipoContacto" defaultValue="Llamada">
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
              <input className="search-input" id="gestion-fecha" name="fechaGestion" type="date" defaultValue={fechaActual} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="gestion-hora">Hora de la gestión *</label>
              <input className="search-input" id="gestion-hora" name="horaGestion" type="time" defaultValue={horaActual} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="gestion-comentario">Observaciones / Detalles *</label>
            <textarea className="search-input" id="gestion-comentario" name="comentario" placeholder="Detalles de la interacción realizada…" required />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="gestion-estado">Nuevo Estado del Cliente *</label>
              <select className="filter-select" id="gestion-estado" name="estadoResultante" value={estado} onChange={event => setEstado(event.target.value)}>
                {estados.map(item => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="gestion-proximo-contacto">Próxima fecha de contacto</label>
              <input className="search-input" id="gestion-proximo-contacto" name="proximoContacto" type="date" value={proximoContacto} onChange={event => setProximoContacto(event.target.value)} />
            </div>
          </div>

          <footer className="modal-form-actions">
            <span className="form-required-legend">* Campos obligatorios</span>
            <button className="btn btn-outline" type="button" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar gestión'}</button>
          </footer>
          {error && <p className="api-error" role="alert">{error}</p>}
        </form>
    </Modal>
  );
}
