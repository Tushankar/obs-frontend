import { Router } from 'express';
import * as c from './events.controller.js';
import * as schemas from './events.schemas.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Public catalog, mounted at /api/v1/events. Only PUBLISHED events. Detail
// (/:slug) + /:slug/similar arrive in task 1.6.
router.get('/', validate({ query: schemas.publicListQuery }), asyncHandler(c.listPublic));

export default router;
