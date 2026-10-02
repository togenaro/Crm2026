/** Devuelve las iniciales de un nombre (máx 2 caracteres) */
export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (!parts[0]) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** Si es ISO datetime con 'T' sin 'Z' ni offset ±hh:mm/±hhmm, lo trata como UTC */
function asUtc(iso) {
  if (typeof iso === 'string' && iso.includes('T') && !/[Zz]$|[+-]\d{2}:?\d{2}$/.test(iso)) {
    return iso + 'Z';
  }
  return iso;
}

/** Formatea una fecha ISO yyyy-mm-dd (o con hora T) a dd/mm/yyyy */
export function formatDate(iso) {
  if (!iso) return '—';
  if (typeof iso === 'string' && iso.includes('T')) {
    const d = new Date(asUtc(iso));
    if (!Number.isNaN(d.getTime())) {
      return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/Argentina/Buenos_Aires',
      }).format(d);
    }
  }
  const cleanIso = iso.includes('T') ? iso.split('T')[0] : iso;
  const parts = cleanIso.split('-');
  if (parts.length < 3) return cleanIso;
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
}

/** Formatea fecha y hora (dd/mm/yyyy · hh:mm) */
export function formatDateTime(fecha, hora) {
  if (!fecha) return '—';
  if (hora) {
    const dateStr = formatDate(fecha);
    return `${dateStr} · ${hora}`;
  }
  if (typeof fecha === 'string' && fecha.includes('T')) {
    const d = new Date(asUtc(fecha));
    if (!Number.isNaN(d.getTime())) {
      const dateStr = new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/Argentina/Buenos_Aires',
      }).format(d);
      const time = new Intl.DateTimeFormat('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Argentina/Buenos_Aires',
      }).format(d);
      return `${dateStr} · ${time}`;
    }
  }
  const dateStr = formatDate(fecha);
  let time = '';
  if (typeof fecha === 'string' && fecha.includes('T')) {
    const t = fecha.split('T')[1];
    if (t && t.length >= 5) {
      time = t.slice(0, 5);
    }
  }
  return time ? `${dateStr} · ${time}` : dateStr;
}

/** Genera un id único simple */
export function genId() {
  return Math.random().toString(36).slice(2, 9);
}

/** Extrae la lista de mensajes de error de la respuesta Axios del backend */
export function extractErrorMessages(err) {
  if (!err) return ['Ocurrió un error inesperado.'];
  const resData = err.response?.data;
  if (resData) {
    if (Array.isArray(resData.errores) && resData.errores.length > 0) {
      return resData.errores;
    }
    if (Array.isArray(resData.errors) && resData.errors.length > 0) {
      return resData.errors;
    }
    if (resData.error) {
      return [resData.error];
    }
    if (resData.message) {
      return [resData.message];
    }
  }
  return [err.message || 'Ocurrió un error al procesar la solicitud.'];
}
