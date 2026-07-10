import { useEffect, useState } from 'react';
import api, { apiError } from '../../lib/api';
import { useApp } from '../../context/AppContext';
import { Modal, Btn, Field, inputCls, selectCls } from '../portal/Kit';

// Admin create / edit of an OBS-platform event (ownership OBS). Publishes
// directly — no organizer submit→approve loop. `initial` (an admin event row)
// switches it to edit mode.
const toLocal = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
};

export default function EventFormModal({ initial, onClose, onSaved }) {
  const { pushToast } = useApp();
  const editing = !!initial?.id;
  const [cats, setCats] = useState([]);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: initial?.title || '',
    categoryId: initial?.category?.id || '',
    description: initial?.description || '',
    isOnline: initial?.isOnline ?? false,
    meetingLink: initial?.meetingLink || '',
    venueName: initial?.venueName || '',
    address: initial?.address || '',
    city: initial?.city || '',
    country: initial?.country || 'India',
    startAt: toLocal(initial?.startAt),
    endAt: toLocal(initial?.endAt),
    bannerUrl: initial?.bannerUrl || '',
    isFeatured: initial?.isFeatured ?? false,
    publish: initial ? initial.status === 'PUBLISHED' : true,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => { api.categories().then(setCats).catch(() => {}); }, []);

  const save = async () => {
    if (form.title.trim().length < 3) { pushToast('Title must be at least 3 characters', false); return; }
    if (form.publish) {
      if (!form.categoryId) { pushToast('Pick a category to publish', false); return; }
      if (!form.description.trim()) { pushToast('Add a description to publish', false); return; }
      if (!form.startAt || !form.endAt) { pushToast('Set start and end times to publish', false); return; }
      if (form.isOnline ? !form.meetingLink.trim() : !form.venueName.trim()) { pushToast(form.isOnline ? 'Add a meeting link' : 'Add a venue name', false); return; }
    }
    const body = {
      title: form.title.trim(),
      isOnline: form.isOnline,
      isFeatured: form.isFeatured,
      publish: form.publish,
      country: form.country.trim() || undefined,
    };
    if (form.categoryId) body.categoryId = form.categoryId;
    if (form.description.trim()) body.description = form.description.trim();
    if (form.startAt) body.startAt = new Date(form.startAt).toISOString();
    if (form.endAt) body.endAt = new Date(form.endAt).toISOString();
    if (form.bannerUrl.trim()) body.bannerUrl = form.bannerUrl.trim();
    if (form.isOnline) { if (form.meetingLink.trim()) body.meetingLink = form.meetingLink.trim(); }
    else {
      if (form.venueName.trim()) body.venueName = form.venueName.trim();
      if (form.address.trim()) body.address = form.address.trim();
      if (form.city.trim()) body.city = form.city.trim();
    }

    setBusy(true);
    try {
      if (editing) await api.adminUpdateEvent(initial.id, body);
      else await api.adminCreateEvent(body);
      pushToast(editing ? 'Event updated' : form.publish ? 'Event published' : 'Draft created');
      onSaved();
    } catch (e) {
      pushToast(apiError(e, 'Could not save event'), false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={editing ? 'Edit OBS event' : 'New OBS event'}
      subtitle="Published directly as an OBS-platform event — no organizer approval needed."
      width="max-w-2xl"
      footer={
        <>
          <Btn variant="ghost" onClick={onClose} disabled={busy}>Cancel</Btn>
          <Btn onClick={save} disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : form.publish ? 'Publish event' : 'Save draft'}</Btn>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Title"><input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="OBS Global Leadership Summit 2026" className={inputCls} autoFocus /></Field>
        </div>
        <Field label="Category">
          <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className={`${selectCls} w-full`}>
            <option value="">Select…</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Format">
          <select value={form.isOnline ? 'online' : 'venue'} onChange={(e) => set('isOnline', e.target.value === 'online')} className={`${selectCls} w-full`}>
            <option value="venue">In-person</option>
            <option value="online">Online</option>
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Description"><textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="What's the event about?" className="w-full resize-y rounded-md border border-[#D5DBE5] bg-white px-3 py-2 text-[13.5px] text-[#1A1F36] outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" /></Field>
        </div>

        {form.isOnline ? (
          <div className="sm:col-span-2">
            <Field label="Meeting link"><input value={form.meetingLink} onChange={(e) => set('meetingLink', e.target.value)} placeholder="https://meet.obs.events/…" className={inputCls} /></Field>
          </div>
        ) : (
          <>
            <Field label="Venue name"><input value={form.venueName} onChange={(e) => set('venueName', e.target.value)} placeholder="Grand Convention Hall" className={inputCls} /></Field>
            <Field label="City"><input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Mumbai" className={inputCls} /></Field>
            <div className="sm:col-span-2">
              <Field label="Address"><input value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Street, area" className={inputCls} /></Field>
            </div>
          </>
        )}

        <Field label="Starts"><input type="datetime-local" value={form.startAt} onChange={(e) => set('startAt', e.target.value)} className={inputCls} /></Field>
        <Field label="Ends"><input type="datetime-local" value={form.endAt} onChange={(e) => set('endAt', e.target.value)} className={inputCls} /></Field>

        <div className="sm:col-span-2">
          <Field label="Banner image URL" hint="Optional — site-relative or absolute."><input value={form.bannerUrl} onChange={(e) => set('bannerUrl', e.target.value)} placeholder="/hero-summit.png" className={inputCls} /></Field>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-[13.5px] text-[#3C4257]">
          <input type="checkbox" checked={form.publish} onChange={(e) => set('publish', e.target.checked)} className="h-4 w-4 accent-[#C99E25]" /> Publish now (go live)
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-[13.5px] text-[#3C4257]">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="h-4 w-4 accent-[#C99E25]" /> Feature on home
        </label>
      </div>
    </Modal>
  );
}
