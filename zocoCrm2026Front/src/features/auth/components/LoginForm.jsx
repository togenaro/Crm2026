import { useForm } from 'react-hook-form';
import { IconBolt } from '../../../components/ui/Icons';
import { USUARIOS, loginAsesor } from '../services/authService';

export default function LoginForm({ onLoginSuccess }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      usuario: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const asesor = await loginAsesor(data);
      onLoginSuccess(asesor.nombre);
    } catch (error) {
      const message = error.response?.status === 401
        ? 'Usuario o contraseña incorrectos.'
        : 'No se pudo conectar con el servidor. Intentá nuevamente.';
      setError('root', { type: 'server', message });
    }
  };

  return (
    <div className="login-card">
      <div className="login-brand">
        <IconBolt />
        <span>ZOCO CRM</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
        <div className="form-group">
          <label className="form-label">Usuario *</label>
          <input
            className="search-input"
            placeholder="Tu nombre de usuario"
            autoComplete="username"
            {...register('usuario', { required: 'Ingresá tu usuario.' })}
          />
          {errors.usuario && <span className="form-error">{errors.usuario.message}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Contraseña *</label>
          <input
            type="password"
            className="search-input"
            placeholder="Tu contraseña"
            autoComplete="current-password"
            {...register('password', { required: 'Ingresá tu contraseña.' })}
          />
          {errors.password && <span className="form-error">{errors.password.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary login-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Ingresando…' : 'Ingresar'}
        </button>

        <p className="login-hint">
          Demo: {USUARIOS.map(u => u.usuario).join(' · ')} · Contraseña: 1234
        </p>
        {errors.root && <span className="form-error">{errors.root.message}</span>}
      </form>
    </div>
  );
}
