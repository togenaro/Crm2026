export const ESTADOS = [
  'Prospecto',
  'Contactado',
  'Interesado',
  'No interesado',
  'Cliente',
];

export function isOverdue(iso) {
  if (!iso) return false;
  const cleanIso = iso.includes('T') ? iso.split('T')[0] : iso;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(cleanIso + 'T00:00:00') < today;
}

export function badgeClass(estado) {
  const map = {
    Prospecto: 'badge-prospecto',
    Contactado: 'badge-contactado',
    Interesado: 'badge-interesado',
    'No interesado': 'badge-no_interesado',
    NoInteresado: 'badge-no_interesado',
    Cliente: 'badge-cliente',
  };
  return map[estado] || 'badge-prospecto';
}
