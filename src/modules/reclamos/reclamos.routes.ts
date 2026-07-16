import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { createReclamoSchema } from './reclamos.schemas';
import { createReclamo } from './reclamos.controller';

const router = Router();

router.post('/', validate(createReclamoSchema), createReclamo);

export default router;
