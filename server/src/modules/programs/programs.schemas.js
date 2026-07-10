import { z } from 'zod';
import { PROGRAM_STATUS } from '../../constants.js';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const idParam = z.object({ id: objectId });
export const slugParam = z.object({ slug: z.string().trim().min(1).max(200) });
export const dayParams = z.object({ slug: z.string().trim().min(1).max(200), n: z.coerce.number().int().min(1).max(100) });
export const adminDayParams = z.object({ id: objectId, n: z.coerce.number().int().min(1).max(100) });

export const dayQuery = z.object({ country: z.string().trim().max(120).optional() });

export const createProgramSchema = z.object({
  name: z.string().trim().min(3).max(160),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/).max(160).optional(),
  year: z.coerce.number().int().min(2000).max(2100),
  startAt: z.coerce.date(),
  endAt: z.coerce.date().optional(),
  theme: z.string().trim().max(200).optional(),
  description: z.string().trim().max(4000).optional(),
  coverUrl: z.string().trim().url().max(500).optional(),
  status: z.enum(PROGRAM_STATUS).optional(),
});
export const updateProgramSchema = createProgramSchema.partial().omit({ slug: true }).refine((v) => Object.keys(v).length > 0, { message: 'Nothing to update' });

export const updateDaySchema = z.object({
  title: z.string().trim().max(200).optional(),
  theme: z.string().trim().max(200).optional(),
}).refine((v) => v.title !== undefined || v.theme !== undefined, { message: 'Nothing to update' });
