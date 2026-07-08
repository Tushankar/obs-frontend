import { Router } from 'express';
import { z } from 'zod';
import * as c from './chapters.controller.js';
import * as schemas from './chapters.schemas.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { optionalAuth } from '../../middleware/optionalAuth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

const slugParam = z.object({ slug: z.string().trim().min(1).max(200) });
const idParam = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id') });

// Public catalog (§7). Detail personalizes (isMember) when signed in. Open
// chapter creation (POST /) is Phase 5; admin CRUD is Phase 3.
router.get('/', validate({ query: schemas.listChaptersQuery }), asyncHandler(c.list));
router.get('/:slug', optionalAuth, validate({ params: slugParam }), asyncHandler(c.getBySlug));
router.post('/:id/join', requireAuth, validate({ params: idParam }), asyncHandler(c.join));
router.delete('/:id/join', requireAuth, validate({ params: idParam }), asyncHandler(c.leave));

export default router;
