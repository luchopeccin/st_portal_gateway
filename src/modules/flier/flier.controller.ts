import { cacheable } from '../../lib/cache';
import * as service from './flier.service';

export const getFlier = cacheable(() => service.getFlier());
