import { useForm } from 'react-hook-form';
import { ESTADOS } from '../clienteHelpers';
import ApiErrorList from '../../../components/ui/ApiErrorList';
import Modal from '../../../components/ui/Modal';
import useApiFormSubmission from '../../../hooks/useApiFormSubmission';

export default function ClienteFormModal({ initial = null, clientes = [], listaAsesores = [], onClose, onSubmit }) {
  const isEdit = initial != null;
  const { errors: apiErrors, loading, submit, clearErrors } = useApiFormSubmission();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: initial?.nombre ?? '',
      cuit: initial?.cuit ?? '',
      telefono: initial?.telefono ?? '',
      email: initial?.email ?? '',
      estado: initial?.estado ?? ESTADOS[0],
      asesor: initial?.asesor ?? '',
    },
  });

  const onFormSubmit = async (data) => {
    clearErrors();
    // Verificar CUIT duplicado en memoria (fallback cliente)
    const isDuplicate = clientes.some(
      c => (c.cuit || '').trim() === data.cuit.trim() && String(c.id) !== String(initial?.id)
    );

    if (isDuplicate) {
      setError('cuit', {
        type: 'manual',
        message: 'Ya existe un cliente con ese CUIT.',
      });
      return;
    }

    await submit(async () => {
      if (isEdit) {
        await onSubmit({
          nombre: data.nombre.trim(),
          cuit: data.cuit.trim(),
          telefono: data.telefono.trim(),
          email: data.email.trim(),
          estado: data.estado,
          asesor: data.asesor.trim(),
        });
      } else {
        const today = new Date().toISOString().split('T')[0];
        await onSubmit({
          id: `c-${Date.now()}`,
          nombre: data.nombre.trim(),
          cuit: data.cuit.trim(),
          telefono: data.telefono.trim(),
          email: data.email.trim(),
          estado: data.estado,
          asesor: data.asesor.trim(),
          proximoContacto: '',
          fechaCreacion: today,
          fechaActualizacion: today,
        });
      }
    });
  };

  return (
    <Modal title={isEdit ? 'Editar cliente' : 'Nuevo cliente'} onClose={onClose}>
        <form onSubmit={handleSubmit(onFormSubmit)} className="modal-body modal-form">
          <ApiErrorList errors={apiErrors} />
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input
              className="search-input"
              placeholder="Nombre del cliente…"
              {...register('nombre', { required: 'El nombre es obligatorio.' })}
            />
            {errors.nombre && <span className="form-error">{errors.nombre.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">CUIT *</label>
            <input
              className="search-input"
              placeholder="30-12345678-9"
              {...register('cuit', { required: 'El CUIT es obligatorio.' })}
            />
            {errors.cuit && <span className="form-error">{errors.cuit.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input
              className="search-input"
              placeholder="+54 9 …"
              {...register('telefono')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="search-input"
              placeholder="contacto@empresa.com"
              {...register('email', {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Formato de email inválido.',
                },
              })}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select className="filter-select" {...register('estado')}>
                {ESTADOS.map(op => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
              {errors.estado && <span className="form-error">{errors.estado.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Asesor *</label>
              <select
                className="filter-select"
                {...register('asesor', { required: 'Seleccioná un asesor.' })}
              >
                <option value="">Seleccioná un asesor</option>
                {listaAsesores.map(nombre => (
                  <option key={nombre} value={nombre}>{nombre}</option>
                ))}
              </select>
              {errors.asesor && <span className="form-error">{errors.asesor.message}</span>}
            </div>
          </div>

          <div className="modal-form-actions">
            <span className="form-required-legend">* Campos obligatorios</span>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Guardar cambios' : 'Guardar cliente'}
            </button>
          </div>
        </form>
    </Modal>
  );
}
