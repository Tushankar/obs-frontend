import * as svc from './programs.service.js';

// public
export async function current(req, res) {
  res.status(200).json(await svc.getCurrentProgram());
}
export async function getBySlug(req, res) {
  res.status(200).json(await svc.getProgramBySlug(req.params.slug));
}
export async function getDay(req, res) {
  res.status(200).json(await svc.getProgramDay(req.params.slug, Number(req.params.n), req.query));
}

// admin
export async function adminList(req, res) {
  res.status(200).json({ programs: await svc.adminListPrograms() });
}
export async function create(req, res) {
  res.status(201).json({ program: await svc.createProgram(req.user.id, req.body) });
}
export async function update(req, res) {
  res.status(200).json({ program: await svc.updateProgram(req.user.id, req.params.id, req.body) });
}
export async function remove(req, res) {
  await svc.deleteProgram(req.user.id, req.params.id);
  res.status(200).json({ ok: true });
}
export async function listDays(req, res) {
  res.status(200).json({ days: await svc.adminListDays(req.params.id) });
}
export async function updateDay(req, res) {
  res.status(200).json({ day: await svc.updateProgramDay(req.user.id, req.params.id, Number(req.params.n), req.body) });
}
