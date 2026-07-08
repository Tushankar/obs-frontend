import { z } from 'zod';
import { EVENT_STATUS } from '../../constants.js';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

// Full editable field set. Every field is individually validated; which ones
// are *required* depends on the action (create needs only a title; submit — task
// 1.4 — enforces the rest).
const eventShape = {
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(160),
  description: z.string().trim().max(20000),
  categoryId: objectId,
  chapterId: objectId.nullable(),
  isOnline: z.boolean(),
  meetingLink: z.string().trim().max(500),
  venueName: z.string().trim().max(200),
  address: z.string().trim().max(500),
  city: z.string().trim().max(120),
  country: z.string().trim().max(120),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  placeId: z.string().trim().max(300),
  timezone: z.string().trim().max(64),
  currency: z.string().trim().length(3).toUpperCase(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  bannerUrl: z.string().trim().max(1000),
};

const eventObject = z.object(eventShape);

// Create: title required, everything else optional (draft-first).
export const createEventSchema = eventObject.partial().extend({ title: eventShape.title });

// Update: all fields optional; at least one must be present.
export const updateEventSchema = eventObject
  .partial()
  .refine((obj) => Object.keys(obj).length > 0, { message: 'No fields to update' });

export const listEventsQuery = z.object({
  status: z.enum(EVENT_STATUS).optional(),
  q: z.string().trim().max(160).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const idParam = z.object({ id: objectId });

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const bannerSchema = z.object({
  contentType: z.enum(IMAGE_TYPES, { errorMap: () => ({ message: 'Banner must be a JPEG, PNG, WebP or GIF image' }) }),
});
