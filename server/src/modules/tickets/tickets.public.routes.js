import { Router } from 'express';
import { z } from 'zod';
import * as c from './tickets.controller.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

// Public ticket validation, mounted at /api/v1/tickets (no auth). Backs the
// /t/:token scan page (§7).
const router = Router();
const tokenParam = z.object({ qrToken: z.string().trim().min(8).max(80) });

router.get('/validate/:qrToken', validate({ params: tokenParam }), asyncHandler(c.validate));

export default router;
