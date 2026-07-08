import Razorpay from 'razorpay';
import { env } from './env.js';

// Razorpay client (test/live keys via env). Returns null when unconfigured so
// callers can 503 cleanly. Webhook signature verification uses the separate
// RAZORPAY_WEBHOOK_SECRET and needs no client.
export const isRazorpayConfigured = () => !!(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);

let client = null;
export function getRazorpay() {
  if (!isRazorpayConfigured()) return null;
  if (!client) client = new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET });
  return client;
}
