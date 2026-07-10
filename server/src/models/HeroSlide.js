import mongoose from 'mongoose';

const { Schema } = mongoose;

// HeroSlide — admin-managed slides for the home hero carousel (site content,
// edited from the admin CMS area). Public render = active slides by sortOrder.
const heroSlideSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    imageUrl: { type: String, required: true },
    ctaText: String, // e.g. "Browse events"
    ctaLink: String, // e.g. /events or an absolute URL
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    updatedById: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

heroSlideSchema.index({ isActive: 1, sortOrder: 1 });

export default mongoose.model('HeroSlide', heroSlideSchema);
