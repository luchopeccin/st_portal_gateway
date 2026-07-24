import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { listQuerySchema } from './documentos.schemas';
import { listDocumentos } from './documentos.controller';

const router = Router();

router.get('/', validate(listQuerySchema), listDocumentos);

export default router;
