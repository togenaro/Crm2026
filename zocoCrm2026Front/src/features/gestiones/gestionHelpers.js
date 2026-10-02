export const TIPOS_CONTACTO = [
  'Llamada',
  'WhatsApp',
  'Correo',
  'Reunión',
  'Otro',
];

export function sortGestionesByDate(gestiones, recentFirst = true) {
  return [...gestiones].sort((a, b) => {
    const dateA = `${a.fechaGestion || a.fecha || ''} ${a.horaGestion || ''}`;
    const dateB = `${b.fechaGestion || b.fecha || ''} ${b.horaGestion || ''}`;
    return recentFirst ? dateB.localeCompare(dateA) : dateA.localeCompare(dateB);
  });
}

export function tipoIcon(tipo) {
  const map = {
    Llamada: '📞',
    WhatsApp: '💬',
    Correo: '✉️',
    Reunión: '🤝',
    Otro: '📌',
  };
  return map[tipo] || '📌';
}
