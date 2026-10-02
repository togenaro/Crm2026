import { createContext, useContext, useEffect, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return undefined;

    const timeoutId = setTimeout(() => setToast(null), 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [toast?.id]);

  const showSuccess = (message) => {
    setToast({ id: Date.now(), message });
  };

  return (
    <ToastContext.Provider value={{ showSuccess }}>
      {children}
      {toast && (
        <div className="success-toast" role="status" aria-live="polite">
          <span className="success-toast-icon" aria-hidden="true">✓</span>
          <span className="success-toast-message">{toast.message}</span>
          <button
            type="button"
            className="success-toast-close"
            aria-label="Cerrar notificación"
            onClick={() => setToast(null)}
          >
            ×
          </button>
          <div className="success-toast-progress" aria-hidden="true">
            <div />
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast debe usarse dentro de ToastProvider');
  return context;
}
