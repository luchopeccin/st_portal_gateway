import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { idParamSchema, listQuerySchema } from './noticias.schemas';
import { getNoticiaById, listNoticias } from './noticias.controller';

const router = Router();

router.get('/', validate(listQuerySchema), listNoticias);
router.get('/:id', validate(idParamSchema), getNoticiaById);

export default router;
