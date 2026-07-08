// Temporary E2E for task 2.6 backend contract — public event detail now exposes
// on-sale ticketTypes + serviceFeePercent (booking card), and the order detail
// shape drives the checkout page. Pay modals are browser/keys (EXIT).
import mongoose from 'mongoose';
import { connectDB } from './src/config/db.js';
import { createApp } from './src/app.js';
import { env } from './src/config/env.js';
import { User, OrganizerProfile, Event, TicketType, Order, Ticket, Session, AuditLog, EmailLog } from './src/models/index.js';

const results = [];
const check = (n, c, e = '') => { results.push({ ok: !!c }); console.log(`${c ? '✓' : '✗'} ${n}${e ? ' — ' + e : ''}`); };

await connectDB();
const app = createApp();
const server = app.listen(0);
await new Promise((r) => server.on('listening', r));
const baseUrl = `http://127.0.0.1:${server.address().port}/api/v1`;
const jf = async (p, o = {}) => {
  const res = await fetch(baseUrl + p, { ...o, headers: { 'Content-Type': 'application/json', ...(o.headers || {}) } });
  let body = null; try { body = await res.json(); } catch { /* */ }
  return { status: res.status, body };
};
const authH = (t) => ({ Authorization: `Bearer ${t}` });
const stamp = Date.now();
const userIds = [], orgIds = [], eventIds = [];

try {
  const admin = await jf('/auth/login', { method: 'POST', body: JSON.stringify({ email: env.SEED_ADMIN_EMAIL, password: env.SEED_ADMIN_PASSWORD }) });
  const adminToken = admin.body.accessToken;
  let r = await jf('/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Ord', email: `v26-org-${stamp}@example.com`, password: 'Password123!' }) });
  const orgToken = r.body.accessToken; userIds.push(r.body.user.id);
  r = await jf('/organizer/apply', { method: 'POST', headers: authH(orgToken), body: JSON.stringify({ orgName: `Ord ${stamp}` }) });
  const orgId = r.body.organizer.id; orgIds.push(orgId);
  await jf(`/admin/organizers/${orgId}/approve`, { method: 'POST', headers: authH(adminToken) });
  const cat = await mongoose.model('Category').findOne();
  r = await jf('/organizer/events', { method: 'POST', headers: authH(orgToken), body: JSON.stringify({ title: `Checkout Event ${stamp}` }) });
  const evId = r.body.event.id; eventIds.push(evId);
  const slug = r.body.event.slug;
  const genId = (await jf(`/organizer/events/${evId}/ticket-types`, { method: 'POST', headers: authH(orgToken), body: JSON.stringify({ name: 'General', price: 50000, quantityTotal: 1000, maxPerOrder: 4 }) })).body.ticketType.id;
  const freeId = (await jf(`/organizer/events/${evId}/ticket-types`, { method: 'POST', headers: authH(orgToken), body: JSON.stringify({ name: 'Free', price: 0, quantityTotal: 100 }) })).body.ticketType.id;
  // an inactive type — must NOT appear on-sale
  await jf(`/organizer/events/${evId}/ticket-types`, { method: 'POST', headers: authH(orgToken), body: JSON.stringify({ name: 'Hidden', price: 10000, quantityTotal: 5, isActive: false }) });
  await jf(`/organizer/events/${evId}`, { method: 'PATCH', headers: authH(orgToken), body: JSON.stringify({ categoryId: String(cat._id), description: 'Checkout data contract.', isOnline: false, venueName: 'Hall', address: 'MG Road, Pune', city: 'Pune', country: 'India', startAt: new Date(Date.now() + 15 * 864e5).toISOString(), endAt: new Date(Date.now() + 15 * 864e5 + 3 * 36e5).toISOString() }) });
  await jf(`/organizer/events/${evId}/submit`, { method: 'POST', headers: authH(orgToken) });
  await jf(`/admin/events/${evId}/approve`, { method: 'POST', headers: authH(adminToken) });

  // Public event detail exposes ticketTypes + serviceFeePercent (no auth).
  r = await jf(`/events/${slug}`);
  const ev = r.body.event;
  check('public event has ticketTypes[]', Array.isArray(ev.ticketTypes) && ev.ticketTypes.length === 3, `count ${ev.ticketTypes?.length}`);
  check('serviceFeePercent present', ev.serviceFeePercent === env.SERVICE_FEE_PERCENT, `${ev.serviceFeePercent}`);
  const gen = ev.ticketTypes.find((t) => t.id === genId);
  const hidden = ev.ticketTypes.find((t) => t.name === 'Hidden');
  check('active in-window type onSale=true w/ availability + min/max', gen?.onSale === true && gen.quantityAvailable === 1000 && gen.maxPerOrder === 4);
  check('inactive type onSale=false', hidden && hidden.onSale === false);

  // Buyer creates an order; /me/orders/:id has everything the checkout page needs.
  r = await jf('/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Buyer', email: `v26-buyer-${stamp}@example.com`, password: 'Password123!' }) });
  const buyerToken = r.body.accessToken; userIds.push(r.body.user.id);
  r = await jf('/orders', { method: 'POST', headers: authH(buyerToken), body: JSON.stringify({ eventId: evId, items: [{ ticketTypeId: genId, quantity: 2 }] }) });
  const orderId = r.body.order.id;
  r = await jf(`/me/orders/${orderId}`, { headers: authH(buyerToken) });
  const o = r.body.order;
  check('order detail has money + items + event + expiresAt for checkout', o.status === 'PENDING' && o.totalAmount === 105000 && o.items[0].name === 'General' && !!o.event?.title && !!o.expiresAt, JSON.stringify({ st: o.status, t: o.totalAmount, ev: !!o.event?.title, exp: !!o.expiresAt }));

  // Free booking → PAID immediately (booking card routes to success).
  r = await jf('/orders', { method: 'POST', headers: authH(buyerToken), body: JSON.stringify({ eventId: evId, items: [{ ticketTypeId: freeId, quantity: 1 }] }) });
  check('free booking → PAID (skip checkout)', r.body.order.status === 'PAID');
} finally {
  await Ticket.deleteMany({ eventId: { $in: eventIds } });
  await Order.deleteMany({ eventId: { $in: eventIds } });
  await TicketType.deleteMany({ eventId: { $in: eventIds } });
  await Event.deleteMany({ _id: { $in: eventIds } });
  await OrganizerProfile.deleteMany({ _id: { $in: orgIds } });
  await User.deleteMany({ _id: { $in: userIds } });
  await Session.deleteMany({ userId: { $in: userIds } });
  await AuditLog.deleteMany({ entityId: { $in: [...orgIds, ...eventIds] } });
  await EmailLog.deleteMany({ toEmail: { $regex: `v26-.*-${stamp}@example.com` } });
  console.log('· cleaned up test data');
  server.close();
  await mongoose.disconnect();
}
const passed = results.filter((r) => r.ok).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
