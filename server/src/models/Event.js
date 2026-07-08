import mongoose from 'mongoose';
import { EVENT_STATUS } from '../constants.js';

const { Schema } = mongoose;

// Core Event schema (§5). The §5.1 additions (ownership / isLaunch / launchAt /
// programId / programDayNumber / speakerIds) are added in Phase 5 alongside the
// community collections they reference.
//
// Draft-first note (Phase 1.2): the wizard (§10) saves a draft per step, so an
// event is created before venue/schedule/category exist. `categoryId`,
// `description`, `startAt`, `endAt` are therefore NOT required at the model
// level — completeness is enforced at SUBMIT (DRAFT → PENDING_APPROVAL, task
// 1.4) in the service layer. `title` + `slug` stay required (needed to create).
const eventSchema = new Schema(
  {
    organizerId: { type: Schema.Types.ObjectId, ref: 'OrganizerProfile', required: true },
    chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter' },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String, // markdown; required at submit
    bannerUrl: String,
    isOnline: { type: Boolean, default: false },
    meetingLink: String, // revealed to ticket holders only
    venueName: String,
    address: String,
    city: String,
    country: String,
    lat: Number,
    lng: Number,
    placeId: String, // Google Place ID (from Places Autocomplete)
    timezone: { type: String, default: 'Asia/Kolkata' },
    currency: { type: String, default: 'INR' },
    startAt: { type: Date }, // required at submit
    endAt: { type: Date }, // required at submit
    status: { type: String, enum: EVENT_STATUS, default: 'DRAFT' },
    rejectionReason: String,
    isFeatured: { type: Boolean, default: false },
    viewsCount: { type: Number, default: 0 },
    reminderSentAt: Date,
    publishedAt: Date,
  },
  { timestamps: true }
);

eventSchema.index({ status: 1, startAt: 1 });
eventSchema.index({ city: 1 });
eventSchema.index({ categoryId: 1 });
eventSchema.index({ chapterId: 1 });
eventSchema.index({ title: 'text', description: 'text' }); // powers ?q= search

export default mongoose.model('Event', eventSchema);
