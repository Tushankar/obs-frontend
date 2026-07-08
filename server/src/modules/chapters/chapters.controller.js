import * as chapterService from './chapters.service.js';

export async function list(req, res) {
  const chapters = await chapterService.listChapters(req.query);
  res.status(200).json({ chapters });
}

export async function getBySlug(req, res) {
  const result = await chapterService.getChapterBySlug(req.params.slug, req.user?.id);
  res.status(200).json(result);
}

export async function join(req, res) {
  const result = await chapterService.joinChapter(req.user.id, req.params.id);
  res.status(200).json(result);
}

export async function leave(req, res) {
  const result = await chapterService.leaveChapter(req.user.id, req.params.id);
  res.status(200).json(result);
}
