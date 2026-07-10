import { Router } from 'express';
import { z } from 'zod';
import { HeroSlide } from '../../models/index.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireRole } from '../../middleware/requireRole.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { writeAudit } from '../../utils/audit.js';
import { notFoundError } from '../../utils/errors.js';

// Home hero carousel (admin-managed site content). Public GET returns the
// active slides in order; the admin CRUD lives under /admin/hero-slides.

export function shapeSlide(s) {
  return {
    id: String(s._id),
    title: s.title,
    subtitle: s.subtitle || null,
    imageUrl: s.imageUrl,
    ctaText: s.ctaText || null,
    ctaLink: s.ctaLink || null,
    sortOrder: s.sortOrder || 0,
    isActive: s.isActive,
    updatedAt: s.updatedAt,
  };
}

const idParam = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id') });
const createSlideSchema = z.object({
  title: z.string().trim().min(2).max(160),
  subtitle: z.string().trim().max(300).optional(),
  imageUrl: z.string().trim().min(1).max(600), // site-relative (/banner.png) or absolute
  ctaText: z.string().trim().max(60).optional(),
  ctaLink: z.string().trim().max(600).optional(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});
const updateSlideSchema = createSlideSchema.partial().refine((v) => Object.keys(v).length > 0, { message: 'Nothing to update' });

// ---- Public ----
export const heroPublicRoutes = Router();
heroPublicRoutes.get('/', asyncHandler(async (req, res) => {
  const rows = await HeroSlide.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 }).limit(12);
  res.status(200).json({ slides: rows.map(shapeSlide) });
}));

// ---- Admin CRUD ----
export const heroAdminRoutes = Router();
heroAdminRoutes.use(requireAuth, requireRole('ADMIN'));

heroAdminRoutes.get('/', asyncHandler(async (req, res) => {
  const rows = await HeroSlide.find({}).sort({ sortOrder: 1, createdAt: 1 });
  res.status(200).json({ slides: rows.map(shapeSlide) });
}));

heroAdminRoutes.post('/', validate({ body: createSlideSchema }), asyncHandler(async (req, res) => {
  const slide = await HeroSlide.create({ ...req.body, updatedById: req.user.id });
  await writeAudit({ actorId: req.user.id, action: 'HERO_SLIDE_CREATED', entityType: 'HeroSlide', entityId: slide._id, meta: { title: slide.title } });
  res.status(201).json({ slide: shapeSlide(slide) });
}));

heroAdminRoutes.patch('/:id', validate({ params: idParam, body: updateSlideSchema }), asyncHandler(async (req, res) => {
  const slide = await HeroSlide.findById(req.params.id);
  if (!slide) throw notFoundError('SLIDE_NOT_FOUND', 'Slide not found');
  Object.assign(slide, req.body, { updatedById: req.user.id });
  await slide.save();
  await writeAudit({ actorId: req.user.id, action: 'HERO_SLIDE_UPDATED', entityType: 'HeroSlide', entityId: slide._id, meta: { title: slide.title } });
  res.status(200).json({ slide: shapeSlide(slide) });
}));

heroAdminRoutes.delete('/:id', validate({ params: idParam }), asyncHandler(async (req, res) => {
  const slide = await HeroSlide.findById(req.params.id);
  if (!slide) throw notFoundError('SLIDE_NOT_FOUND', 'Slide not found');
  await slide.deleteOne();
  await writeAudit({ actorId: req.user.id, action: 'HERO_SLIDE_DELETED', entityType: 'HeroSlide', entityId: req.params.id, meta: { title: slide.title } });
  res.status(200).json({ ok: true });
}));
