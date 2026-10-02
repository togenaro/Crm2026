export const USUARIOS = [
  { usuario: 'carlos', nombre: 'Carlos Vega' },
  { usuario: 'laura', nombre: 'Laura Gómez' },
  { usuario: 'martin', nombre: 'Martín Ruiz' },
];

function sinTildes(texto = '') {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function resolveAsesor(input = '') {
  const busqueda = sinTildes(input.trim().toLowerCase());
  if (!busqueda) return null;
  const usuario = USUARIOS.find(item =>
    item.usuario === busqueda || sinTildes(item.nombre.toLowerCase()) === busqueda,
  );
  return usuario?.nombre ?? null;
}
