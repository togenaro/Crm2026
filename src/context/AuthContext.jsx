import { createContext, useContext, useState } from 'react';

const SESSION_KEY = 'crm_zoco_session';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY));
      return session?.nombre ? session : null;
    } catch {
      return null;
    }
  });

  function login(nombre) {
    const session = { nombre };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // La sesión sigue funcionando en memoria si el almacenamiento no está disponible.
    }
    setUsuario(session);
  }

  function logout() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // La sesión se elimina también del estado de React.
    }
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
}
