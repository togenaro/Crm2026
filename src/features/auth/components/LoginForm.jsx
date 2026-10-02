import { useState } from 'react';
import { IconBolt } from '../../../components/ui/Icons';
import { USUARIOS, resolveAsesor } from '../services/authService';

export default function LoginForm({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  function submit(event) {
    event.preventDefault();
    const asesor = resolveAsesor(usuario);
    if (!usuario.trim()) return setErrors({ usuario: 'Ingresá tu usuario.' });
    if (!asesor) return setErrors({ usuario: 'Usuario no reconocido para esta demo.' });
    if (!password) return setErrors({ password: 'Ingresá tu contraseña.' });
    setErrors({});
    onLoginSuccess(asesor);
  }

  return (
    <div className="login-card">
      <div className="login-brand">
        <IconBolt />
        <span>ZOCO CRM</span>
      </div>
      <form className="modal-form" onSubmit={submit}>
        <div className="form-group">
          <label className="form-label" htmlFor="usuario">Usuario *</label>
          <input className="search-input" id="usuario" name="usuario" placeholder="Tu nombre de usuario" autoComplete="username" value={usuario} onChange={event => setUsuario(event.target.value)} />
          {errors.usuario && <span className="form-error">{errors.usuario}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">Contraseña *</label>
          <input className="search-input" id="password" name="password" type="password" placeholder="Tu contraseña" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} />
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>
        <button className="btn btn-primary login-submit" type="submit">Ingresar</button>
        <p className="login-hint">Demo: {USUARIOS.map(item => item.usuario).join(' · ')} (cualquier contraseña)</p>
      </form>
    </div>
  );
}
