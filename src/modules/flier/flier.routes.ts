import { Router } from 'express';
import { getFlier } from './flier.controller';

const router = Router();

router.get('/', getFlier);

export default router;
