import { cacheable } from '../../lib/cache';
import * as service from './menu.service';

export const getMenu = cacheable(() => service.getMenu());
