import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { slugParamSchema } from './paginas.schemas';
import { getPaginaBySlug } from './paginas.controller';

const router = Router();

router.get('/:slug', validate(slugParamSchema), getPaginaBySlug);

export default router;
