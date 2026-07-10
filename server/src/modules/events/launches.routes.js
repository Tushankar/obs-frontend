import { Router } from 'express';
import { z } from 'zod';
import * as c from './events.controller.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

// Public Launchpad (§5.6). Mounted at /api/v1/launches.
const router = Router();
const query = z.object({ scope: z.enum(['upcoming', 'recent']).optional() });
router.get('/', validate({ query }), asyncHandler(c.launches));

export default router;
