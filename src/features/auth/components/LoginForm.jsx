function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z" />
    </svg>
  );
}

export default function LoginForm() {
  return (
    <section className="login-card" aria-label="Inicio de sesión">
      <div className="login-brand">
        <BoltIcon />
        <span>ZOCO CRM</span>
      </div>

      <form className="login-form" onSubmit={event => event.preventDefault()}>
        <div className="form-group">
          <label className="form-label" htmlFor="usuario">Usuario *</label>
          <input
            className="search-input"
            id="usuario"
            name="usuario"
            placeholder="Tu nombre de usuario"
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Contraseña *</label>
          <input
            className="search-input"
            id="password"
            name="password"
            type="password"
            placeholder="Tu contraseña"
            autoComplete="current-password"
          />
        </div>

        <button className="btn btn-primary login-submit" type="submit">
          Ingresar
        </button>

        <p className="login-hint">
          Demo: carlos · laura · martin (cualquier contraseña)
        </p>
      </form>
    </section>
  );
}
