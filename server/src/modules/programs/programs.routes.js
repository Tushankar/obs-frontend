import { Router } from 'express';
import * as c from './programs.controller.js';
import * as schemas from './programs.schemas.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

// Public 100 Days Program (§5.5). Mounted at /api/v1/programs. `/current` is
// declared before `/:slug` so the literal isn't captured by the slug param.
const router = Router();
router.get('/current', asyncHandler(c.current));
router.get('/:slug', validate({ params: schemas.slugParam }), asyncHandler(c.getBySlug));
router.get('/:slug/days/:n', validate({ params: schemas.dayParams, query: schemas.dayQuery }), asyncHandler(c.getDay));

export default router;
