import { cacheable } from '../../lib/cache';
import * as service from './estadisticas.service';

export const getEstadisticas = cacheable(() => service.getEstadisticas());
