import { asyncHandler } from '../../lib/asyncHandler';
import * as service from './flier.service';

export const getFlier = asyncHandler(async (_req, res) => {
  const flier = await service.getFlier();
  res.json(flier);
});
