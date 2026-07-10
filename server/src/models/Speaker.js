import mongoose from 'mongoose';

const { Schema } = mongoose;

// Speaker (§5.1) — profiles that organizers attach to their events via
// Event.speakerIds. Admin-managed CRUD; public directory + profile pages.
const speakerSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    photoUrl: String,
    title: String, // role, e.g. "Managing Partner"
    company: String,
    bio: String,
    topics: [String],
    linkedin: String,
    twitter: String,
    website: String,
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

speakerSchema.index({ isFeatured: 1, sortOrder: 1 });

export default mongoose.model('Speaker', speakerSchema);
