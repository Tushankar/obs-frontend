import { Router } from 'express';
import * as c from './speakers.controller.js';
import * as schemas from './speakers.schemas.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireRole } from '../../middleware/requireRole.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

// Admin speaker CRUD (§5.2). Mounted at /api/v1/admin/speakers.
const router = Router();
router.use(requireAuth, requireRole('ADMIN'));

router.get('/', asyncHandler(c.adminList));
router.post('/', validate({ body: schemas.createSpeakerSchema }), asyncHandler(c.create));
router.patch('/:id', validate({ params: schemas.idParam, body: schemas.updateSpeakerSchema }), asyncHandler(c.update));
router.delete('/:id', validate({ params: schemas.idParam }), asyncHandler(c.remove));

export default router;
