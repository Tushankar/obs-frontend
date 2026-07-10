import mongoose from 'mongoose';

const { Schema } = mongoose;

// ProgramDay (§5.1) — Day 1..100 of an edition.
const programDaySchema = new Schema(
  {
    programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
    dayNumber: { type: Number, required: true }, // 1..100
    date: { type: Date, required: true },
    title: String,
    theme: String,
  },
  { timestamps: true }
);

programDaySchema.index({ programId: 1, dayNumber: 1 }, { unique: true });

export default mongoose.model('ProgramDay', programDaySchema);
