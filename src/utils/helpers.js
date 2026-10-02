export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (!parts[0]) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function asUtc(value) {
  if (typeof value === 'string' && value.includes('T') && !/[Zz]$|[+-]\d{2}:?\d{2}$/.test(value)) {
    return `${value}Z`;
  }
  return value;
}

export function formatDate(value) {
  if (!value) return '—';
  if (typeof value === 'string' && value.includes('T')) {
    const date = new Date(asUtc(value));
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        timeZone: 'America/Argentina/Buenos_Aires',
      }).format(date);
    }
  }
  const [year, month, day] = value.split('T')[0].split('-');
  return year && month && day ? `${day}/${month}/${year}` : value;
}

export function formatDateTime(value, time) {
  if (!value) return '—';
  if (time) return `${formatDate(value)} · ${time}`;
  if (value.includes('T')) {
    const date = new Date(asUtc(value));
    if (!Number.isNaN(date.getTime())) {
      const dateText = formatDate(value);
      const timeText = new Intl.DateTimeFormat('es-AR', {
        hour: '2-digit', minute: '2-digit', hour12: false,
        timeZone: 'America/Argentina/Buenos_Aires',
      }).format(date);
      return `${dateText} · ${timeText}`;
    }
  }
  return formatDate(value);
}

export function genId() {
  return Math.random().toString(36).slice(2, 9);
}

export function extractErrorMessages(error) {
  if (!error) return ['Ocurrió un error inesperado.'];
  const data = error.response?.data;
  if (Array.isArray(data?.errores) && data.errores.length) return data.errores;
  if (Array.isArray(data?.errors) && data.errors.length) return data.errors;
  if (data?.error) return [data.error];
  if (data?.message) return [data.message];
  return [error.message || 'Ocurrió un error al procesar la solicitud.'];
}
