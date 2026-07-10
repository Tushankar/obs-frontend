import { Router } from 'express';
import * as c from './programs.controller.js';
import * as schemas from './programs.schemas.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireRole } from '../../middleware/requireRole.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

// Admin program + day CRUD (§5.5). Mounted at /api/v1/admin/programs.
const router = Router();
router.use(requireAuth, requireRole('ADMIN'));

router.get('/', asyncHandler(c.adminList));
router.post('/', validate({ body: schemas.createProgramSchema }), asyncHandler(c.create));
router.patch('/:id', validate({ params: schemas.idParam, body: schemas.updateProgramSchema }), asyncHandler(c.update));
router.delete('/:id', validate({ params: schemas.idParam }), asyncHandler(c.remove));
router.get('/:id/days', validate({ params: schemas.idParam }), asyncHandler(c.listDays));
router.patch('/:id/days/:n', validate({ params: schemas.adminDayParams, body: schemas.updateDaySchema }), asyncHandler(c.updateDay));

export default router;
