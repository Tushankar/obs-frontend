import mongoose from 'mongoose';
import { PROGRAM_STATUS } from '../constants.js';

const { Schema } = mongoose;

// Program (§5.1) — one 100 Days edition per year (15 Oct → 22 Jan = 100 days).
const programSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g. "OBS 100 Days 2026"
    slug: { type: String, required: true, unique: true },
    year: { type: Number, required: true },
    startAt: { type: Date, required: true }, // Day 1 (15 Oct)
    endAt: { type: Date, required: true }, // Day 100 (22 Jan next year)
    theme: String,
    description: String,
    coverUrl: String,
    status: { type: String, enum: PROGRAM_STATUS, default: 'UPCOMING' },
  },
  { timestamps: true }
);

programSchema.index({ year: -1 });

export default mongoose.model('Program', programSchema);
