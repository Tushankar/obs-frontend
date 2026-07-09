import { Event } from '../models/index.js';

// §8.6 completeEvents (hourly): PUBLISHED events whose endAt is in the past →
// COMPLETED. Idempotent (only flips PUBLISHED rows).
export async function completeEvents(now = new Date()) {
  const res = await Event.updateMany({ status: 'PUBLISHED', endAt: { $lt: now } }, { $set: { status: 'COMPLETED' } });
  if (res.modifiedCount) console.log(`[cron completeEvents] marked ${res.modifiedCount} event(s) COMPLETED`);
  return res.modifiedCount;
}
