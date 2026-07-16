import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { listQuerySchema } from './ordenanzas.schemas';
import { listOrdenanzas } from './ordenanzas.controller';

const router = Router();

router.get('/', validate(listQuerySchema), listOrdenanzas);

export default router;
