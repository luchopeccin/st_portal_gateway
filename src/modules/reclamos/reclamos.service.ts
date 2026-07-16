import { strapiCreate } from '../../clients/strapi.client';

interface ReclamoInput {
  nombre: string;
  email: string;
  categoria: string;
  mensaje: string;
}

export async function createReclamo(input: ReclamoInput): Promise<void> {
  // Se arma el objeto campo por campo desde el body ya validado (nunca spread
  // directo del body) para evitar mass assignment hacia Strapi.
  await strapiCreate('reclamos', {
    nombre: input.nombre,
    email: input.email,
    categoria: input.categoria,
    mensaje: input.mensaje,
  });
}
