import { Router } from 'express';
import * as c from './sponsors.controller.js';
import * as schemas from './sponsors.schemas.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireRole } from '../../middleware/requireRole.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

// Admin sponsor CRUD + partner-application queue (§5.3). Mounted at /api/v1/admin
// (before the catch-all adminRoutes).
const router = Router();
router.use(requireAuth, requireRole('ADMIN'));

router.get('/sponsors', asyncHandler(c.adminList));
router.post('/sponsors', validate({ body: schemas.createSponsorSchema }), asyncHandler(c.create));
router.patch('/sponsors/:id', validate({ params: schemas.idParam, body: schemas.updateSponsorSchema }), asyncHandler(c.update));
router.delete('/sponsors/:id', validate({ params: schemas.idParam }), asyncHandler(c.remove));

router.get('/partner-applications', validate({ query: schemas.listApplicationsQuery }), asyncHandler(c.adminListApplications));
router.patch('/partner-applications/:id', validate({ params: schemas.idParam, body: schemas.updateApplicationSchema }), asyncHandler(c.updateApplication));

export default router;
