import { useForm } from 'react-hook-form';
import { ESTADOS } from '../../clientes/clienteHelpers';
import ApiErrorList from '../../../components/ui/ApiErrorList';
import Modal from '../../../components/ui/Modal';
import useApiFormSubmission from '../../../hooks/useApiFormSubmission';

export default function GestionesFormModal({
  clientes = [],
  initialClienteId = '',
  onClose,
  onSubmit,
  usuario,
  lockCliente = false,
  editingGestion = null,
}) {
  const initialClient = clientes.find(c => String(c.id) === String(initialClienteId)) || null;
  const { errors: apiErrors, loading, submit, clearErrors } = useApiFormSubmission();

  const now = new Date();
  const defaultFecha = now.toISOString().split('T')[0];
  const defaultHora = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      clienteId: editingGestion?.clienteId || initialClienteId,
      tipoContacto: editingGestion?.tipoContacto || 'Llamada',
      fechaGestion: editingGestion?.fechaGestion?.split('T')[0] || defaultFecha,
      horaGestion: editingGestion?.fechaGestion?.split('T')[1]?.slice(0, 5) || defaultHora,
      comentario: editingGestion?.comentario || '',
      estadoResultante: editingGestion?.estadoResultante ?? initialClient?.estado ?? ESTADOS[0],
      proximoContacto: editingGestion?.proximoContacto?.split('T')[0] || initialClient?.proximoContacto?.split('T')[0] || '',
    },
  });

  const selectedClienteId = watch('clienteId');
  const selectedCliente = clientes.find(c => String(c.id) === String(selectedClienteId));

  const handlePickClient = (e) => {
    const id = e.target.value;
    setValue('clienteId', id);
    const picked = clientes.find(c => String(c.id) === String(id));
    if (picked) {
      setValue('estadoResultante', picked.estado);
      setValue('proximoContacto', picked.proximoContacto || '');
    }
  };

  const onFormSubmit = async (data) => {
    clearErrors();
    const cliente = clientes.find(c => String(c.id) === String(data.clienteId));
    const asesorSesion = (typeof usuario === 'string' ? usuario : usuario?.nombre || '').trim();
    const fecha = data.fechaGestion || defaultFecha;
    const hora = data.horaGestion || defaultHora;
    const fechaGestionIso = `${fecha}T${hora}:00`;

    const nuevaGestion = {
      id: editingGestion?.id || `g-${Date.now()}`,
      clienteId: data.clienteId,
      fechaGestion: fecha,
      horaGestion: hora,
      fechaGestionIso: fechaGestionIso,
      tipoContacto: data.tipoContacto,
      comentario: data.comentario.trim(),
      estadoResultante: data.estadoResultante,
      asesor: asesorSesion || cliente?.asesor || 'Asesor Asignado',
    };

    await submit(async () => {
      await onSubmit(nuevaGestion, data.estadoResultante, data.proximoContacto);
    });
  };

  return (
    <Modal
      title={editingGestion ? 'Editar gestión' : 'Nueva gestión'}
      subtitle={selectedCliente?.nombre && <>Cliente: <strong>{selectedCliente.nombre}</strong></>}
      onClose={onClose}
    >
        <form onSubmit={handleSubmit(onFormSubmit)} className="modal-body modal-form">
          <ApiErrorList errors={apiErrors} />
          {lockCliente ? (
            <input type="hidden" {...register('clienteId')} />
          ) : (
            <div className="form-group">
              <label className="form-label">Cliente *</label>
              <select
                className="filter-select"
                {...register('clienteId', { required: 'Seleccioná un cliente.' })}
                onChange={handlePickClient}
              >
                <option value="">Seleccionar cliente…</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} · CUIT {c.cuit}
                  </option>
                ))}
              </select>
              {errors.clienteId && <span className="form-error">{errors.clienteId.message}</span>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Tipo de gestión</label>
            <select className="filter-select" {...register('tipoContacto')}>
              <option value="Llamada">Llamada</option>
              <option value="Correo">Correo / Email</option>
              <option value="Reunión">Reunión</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Fecha de la gestión *</label>
              <input
                type="date"
                className="search-input"
                {...register('fechaGestion', { required: 'La fecha de la gestión es obligatoria.' })}
              />
              {errors.fechaGestion && <span className="form-error">{errors.fechaGestion.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Hora de la gestión *</label>
              <input
                type="time"
                className="search-input"
                {...register('horaGestion', { required: 'La hora de la gestión es obligatoria.' })}
              />
              {errors.horaGestion && <span className="form-error">{errors.horaGestion.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Observaciones / Detalles *</label>
            <textarea
              className="search-input"
              placeholder="Detalles de la interacción realizada…"
              {...register('comentario', { required: 'El comentario es obligatorio.' })}
            />
            {errors.comentario && <span className="form-error">{errors.comentario.message}</span>}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Nuevo Estado del Cliente *</label>
              <select
                className="filter-select"
                {...register('estadoResultante', { required: 'Seleccioná el nuevo estado del cliente.' })}
              >
                <option value="">Seleccionar estado…</option>
                {ESTADOS.map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
              {errors.estadoResultante && <span className="form-error">{errors.estadoResultante.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Próxima fecha de contacto</label>
              <input
                type="date"
                className="search-input"
                {...register('proximoContacto')}
              />
            </div>
          </div>

          <div className="modal-form-actions">
            <span className="form-required-legend">* Campos obligatorios</span>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {editingGestion ? 'Guardar cambios' : 'Guardar gestión'}
            </button>
          </div>
        </form>
    </Modal>
  );
}
