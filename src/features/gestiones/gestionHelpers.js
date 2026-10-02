export const TIPOS_CONTACTO = [
  'Llamada',
  'WhatsApp',
  'Correo',
  'Reunión',
  'Otro',
];

export function sortGestionesByDate(gestiones, recentFirst = true) {
  return [...gestiones].sort((first, second) => {
    const dateFirst = `${first.fechaGestion || first.fecha || ''} ${first.horaGestion || ''}`;
    const dateSecond = `${second.fechaGestion || second.fecha || ''} ${second.horaGestion || ''}`;
    return recentFirst ? dateSecond.localeCompare(dateFirst) : dateFirst.localeCompare(dateSecond);
  });
}

export function tipoIcon(tipo) {
  const icons = {
    Llamada: '📞',
    WhatsApp: '💬',
    Correo: '✉️',
    Reunión: '🤝',
    Otro: '📌',
  };
  return icons[tipo] || '📌';
}
