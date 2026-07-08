import { Chapter, ChapterMember, Event } from '../../models/index.js';
import { notFoundError } from '../../utils/errors.js';
import { publicEventCard } from '../events/events.service.js';

export function shapeChapter(c) {
  return {
    id: String(c._id),
    name: c.name,
    slug: c.slug,
    type: c.type,
    tier: c.tier || null,
    pillarGroup: c.pillarGroup || null,
    ecosystemTier: c.ecosystemTier || null,
    countryCode: c.countryCode || null,
    flagEmoji: c.flagEmoji || null,
    isFlagship: !!c.isFlagship,
    isOfficial: !!c.isOfficial,
    sortOrder: c.sortOrder || 0,
  };
}

// Public list of visible chapters (wizard dropdown + browse filter). The grouped
// directory, :slug detail and join/leave land in task 1.6.
export async function listChapters({ type, tier } = {}) {
  const filter = { status: 'APPROVED', isActive: true };
  if (type) filter.type = type;
  if (tier) filter.tier = tier;
  const rows = await Chapter.find(filter).sort({ sortOrder: 1, name: 1 });
  return rows.map(shapeChapter);
}

// Chapter detail (by slug) + member count + upcoming events + (if signed in)
// whether the caller is a member.
export async function getChapterBySlug(slug, userId) {
  const chapter = await Chapter.findOne({ slug, status: 'APPROVED' });
  if (!chapter) throw notFoundError('CHAPTER_NOT_FOUND', 'Chapter not found');
  const [memberCount, events, membership] = await Promise.all([
    ChapterMember.countDocuments({ chapterId: chapter._id }),
    Event.find({ chapterId: chapter._id, status: 'PUBLISHED', endAt: { $gte: new Date() } })
      .populate('categoryId', 'name slug')
      .populate('chapterId', 'name slug flagEmoji')
      .sort({ startAt: 1 })
      .limit(24),
    userId ? ChapterMember.exists({ chapterId: chapter._id, userId }) : Promise.resolve(null),
  ]);
  return {
    chapter: { ...shapeChapter(chapter), description: chapter.description || null, coverUrl: chapter.coverUrl || null },
    memberCount,
    isMember: !!membership,
    events: events.map(publicEventCard),
  };
}

async function memberCountOf(chapterId) {
  return ChapterMember.countDocuments({ chapterId });
}

export async function joinChapter(userId, chapterId) {
  const chapter = await Chapter.findById(chapterId);
  if (!chapter || chapter.status !== 'APPROVED') throw notFoundError('CHAPTER_NOT_FOUND', 'Chapter not found');
  await ChapterMember.updateOne(
    { chapterId, userId },
    { $setOnInsert: { chapterId, userId, joinedAt: new Date() } },
    { upsert: true }
  );
  return { joined: true, memberCount: await memberCountOf(chapterId) };
}

export async function leaveChapter(userId, chapterId) {
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) throw notFoundError('CHAPTER_NOT_FOUND', 'Chapter not found');
  await ChapterMember.deleteOne({ chapterId, userId });
  return { joined: false, memberCount: await memberCountOf(chapterId) };
}
