import { createContext, useContext, useState, useEffect } from 'react';

const SESSION_KEY = 'crm_zoco_session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.nombre) return null;
      return parsed;
    } catch {
      return null;
    }
  });

  const login = (nombre) => {
    const session = { nombre };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      /* almacenamiento no disponible */
    }
    setUsuario(session);
  };

  const logout = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* almacenamiento no disponible */
    }
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
