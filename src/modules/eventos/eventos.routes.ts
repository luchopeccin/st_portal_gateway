import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { idParamSchema, listQuerySchema } from './eventos.schemas';
import { getEventoById, listEventos } from './eventos.controller';

const router = Router();

router.get('/', validate(listQuerySchema), listEventos);
router.get('/:id', validate(idParamSchema), getEventoById);

export default router;
