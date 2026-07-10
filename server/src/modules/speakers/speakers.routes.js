import { Router } from 'express';
import * as c from './speakers.controller.js';
import * as schemas from './speakers.schemas.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

// Public speakers directory + profile (§5.2). Mounted at /api/v1/speakers.
const router = Router();
router.get('/', validate({ query: schemas.listSpeakersQuery }), asyncHandler(c.list));
router.get('/:slug', validate({ params: schemas.slugParam }), asyncHandler(c.getBySlug));

export default router;
