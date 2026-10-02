export const ESTADOS = [
  'Prospecto',
  'Contactado',
  'Interesado',
  'No interesado',
  'Cliente',
];

export function isOverdue(iso) {
  if (!iso) return false;
  const date = iso.includes('T') ? iso.split('T')[0] : iso;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${date}T00:00:00`) < today;
}

export function badgeClass(status) {
  const classes = {
    Prospecto: 'badge-prospecto',
    Contactado: 'badge-contactado',
    Interesado: 'badge-interesado',
    'No interesado': 'badge-no_interesado',
    NoInteresado: 'badge-no_interesado',
    Cliente: 'badge-cliente',
  };
  return classes[status] || 'badge-prospecto';
}
