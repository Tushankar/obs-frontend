import { Router } from 'express';
import * as c from './webhooks.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

// Mounted at /api/v1/webhooks with express.raw() BEFORE express.json() so the
// raw request body is available for signature verification. Stripe added in 2.4.
const router = Router();

router.post('/razorpay', asyncHandler(c.razorpay_));

export default router;
