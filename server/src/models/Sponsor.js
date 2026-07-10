import mongoose from 'mongoose';
import { SPONSOR_TIER, SPONSOR_SCOPE } from '../constants.js';

const { Schema } = mongoose;

// Sponsor (§5.1). scope PLATFORM (site-wide showcase) / PROGRAM (a 100 Days
// edition) / EVENT (a single event, queried by eventId — no array on Event).
const sponsorSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    logoUrl: String,
    website: String,
    tier: { type: String, enum: SPONSOR_TIER, required: true },
    scope: { type: String, enum: SPONSOR_SCOPE, default: 'PLATFORM' },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' }, // when scope = EVENT
    programId: { type: Schema.Types.ObjectId, ref: 'Program' }, // when scope = PROGRAM
    blurb: String,
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

sponsorSchema.index({ scope: 1, isActive: 1, sortOrder: 1 });
sponsorSchema.index({ eventId: 1 });

export default mongoose.model('Sponsor', sponsorSchema);
