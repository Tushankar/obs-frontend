import { useEffect, useState } from 'react';
import { PageHead, Card, Btn, Loading, EmptyState, Pill, Modal, ConfirmDialog, Field, inputCls, selectCls } from '../../components/portal/Kit';
import { useApp } from '../../context/AppContext';
import api, { apiError } from '../../lib/api';
import { AdminIcon } from '../../components/admin/AdminIcons';

const TIERS = ['TITLE', 'PRESENTING', 'EVENT', 'TECHNOLOGY', 'MEDIA', 'PARTNER'];
const SCOPES = ['PLATFORM', 'PROGRAM', 'EVENT'];
const cap = (s) => s.charAt(0) + s.slice(1).toLowerCase();
const SCOPE_HINT = {
  PLATFORM: 'Shown site-wide on the Sponsors page.',
  PROGRAM: 'Tied to a 100 Days program edition (paste its ID).',
  EVENT: 'Tied to a single event (paste its ID).',
};

function SponsorEditor({ initial, onClose, onSaved }) {
  const { pushToast } = useApp();
  const editing = !!initial?.id;
  const [form, setForm] = useState({
    name: initial?.name || '', logoUrl: initial?.logoUrl || '', website: initial?.website || '',
    tier: initial?.tier || 'PARTNER', scope: initial?.scope || 'PLATFORM',
    eventId: initial?.eventId || '', programId: initial?.programId || '',
    blurb: initial?.blurb || '', sortOrder: initial?.sortOrder ?? 0,
    isActive: initial?.isActive ?? true,
  });
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (form.name.trim().length < 2) { pushToast('Enter the sponsor name', false); return; }
    const body = {
      name: form.name.trim(),
      logoUrl: form.logoUrl.trim() || undefined,
      website: form.website.trim() || undefined,
      tier: form.tier,
      scope: form.scope,
      blurb: form.blurb.trim() || undefined,
      sortOrder: Number(form.sortOrder) || 0,
      isActive: !!form.isActive,
      eventId: form.scope === 'EVENT' ? (form.eventId.trim() || undefined) : undefined,
      programId: form.scope === 'PROGRAM' ? (form.programId.trim() || undefined) : undefined,
    };
    setBusy(true);
    try {
      if (editing) await api.updateSponsor(initial.id, body);
      else await api.createSponsor(body);
      pushToast(editing ? 'Sponsor updated' : 'Sponsor added');
      onSaved();
    } catch (e) {
      pushToast(apiError(e, 'Could not save sponsor'), false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={editing ? 'Edit sponsor' : 'New sponsor'}
      subtitle="Sponsors appear on the public showcase, grouped by tier."
      width="max-w-xl"
      footer={
        <>
          <Btn variant="ghost" onClick={onClose} disabled={busy}>Cancel</Btn>
          <Btn onClick={save} disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Add sponsor'}</Btn>
        </>
      }
    >
      <div className="grid gap-3.5 sm:grid-cols-2">
        <Field label="Name"><input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Meridian Capital" autoFocus className={inputCls} /></Field>
        <Field label="Logo URL"><input value={form.logoUrl} onChange={(e) => set('logoUrl', e.target.value)} placeholder="https://…" className={inputCls} /></Field>
        <Field label="Tier">
          <select value={form.tier} onChange={(e) => set('tier', e.target.value)} className={`${selectCls} w-full`}>
            {TIERS.map((t) => <option key={t} value={t}>{cap(t)}</option>)}
          </select>
        </Field>
        <Field label="Website"><input value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://…" className={inputCls} /></Field>
        <Field label="Scope" hint={SCOPE_HINT[form.scope]}>
          <select value={form.scope} onChange={(e) => set('scope', e.target.value)} className={`${selectCls} w-full`}>
            {SCOPES.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
          </select>
        </Field>
        {form.scope === 'EVENT' && <Field label="Event ID"><input value={form.eventId} onChange={(e) => set('eventId', e.target.value)} placeholder="24-char event id" className={inputCls} /></Field>}
        {form.scope === 'PROGRAM' && <Field label="Program ID"><input value={form.programId} onChange={(e) => set('programId', e.target.value)} placeholder="24-char program id" className={inputCls} /></Field>}
        <Field label="Sort order" hint="Lower shows first"><input type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} className={inputCls} /></Field>
        <div className="sm:col-span-2">
          <Field label="Blurb" hint="One line shown on hover / detail"><textarea value={form.blurb} onChange={(e) => set('blurb', e.target.value)} rows={2} placeholder="Short description of the sponsor…" className={`${inputCls} resize-y`} /></Field>
        </div>
        <label className="sm:col-span-2 flex items-center gap-2.5 rounded-lg border border-[#E3E8EE] bg-[#F7FAFC] px-3.5 py-2.5 cursor-pointer">
          <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} className="h-4 w-4 accent-[#8E6B1D]" />
          <span className="text-[13px] font-medium text-[#1A1F36]">Active</span>
          <span className="text-[12px] text-[#8792A2]">— visible on the public site</span>
        </label>
      </div>
    </Modal>
  );
}

export default function Sponsors() {
  const { pushToast } = useApp();
  const [rows, setRows] = useState(null);
  const [editor, setEditor] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  const load = () => api.adminSponsors().then(setRows).catch((e) => { setRows([]); pushToast(apiError(e), false); });
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const remove = async () => {
    if (!confirm) return;
    setBusy(true);
    try {
      await api.deleteSponsor(confirm.id);
      pushToast(`Removed ${confirm.name}`);
      setConfirm(null);
      load();
    } catch (e) {
      pushToast(apiError(e, 'Could not remove sponsor'), false);
    } finally {
      setBusy(false);
    }
  };

  if (!rows) return <Loading />;

  return (
    <div>
      <PageHead
        title="Sponsors"
        subtitle={rows.length ? `${rows.length} sponsor${rows.length === 1 ? '' : 's'}` : 'Sponsor showcase'}
        actions={<Btn onClick={() => setEditor({})}><AdminIcon.Plus size={15} /> New sponsor</Btn>}
      />

      {rows.length === 0 ? (
        <EmptyState icon={<AdminIcon.Sponsors size={30} />} title="No sponsors yet" subtitle="Add sponsors to build the public showcase." action={<Btn onClick={() => setEditor({})}><AdminIcon.Plus size={15} /> New sponsor</Btn>} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((s) => (
            <Card key={s.id} className="flex flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="grid h-12 w-[72px] shrink-0 place-items-center overflow-hidden rounded-md border border-[#EDF0F4] bg-white">
                  {s.logoUrl ? <img src={s.logoUrl} alt={s.name} className="max-h-10 max-w-[64px] object-contain" /> : <span className="text-[10px] font-semibold text-[#C9D2DE]">No logo</span>}
                </div>
                {!s.isActive && <Pill tone="gray">Hidden</Pill>}
              </div>
              <div className="mt-3 truncate text-[14px] font-semibold text-[#1A1F36]">{s.name}</div>
              <div className="mt-1.5 flex flex-wrap gap-1">
                <Pill tone="brand">{cap(s.tier)}</Pill>
                <Pill tone="gray">{cap(s.scope)}</Pill>
              </div>
              {s.blurb && <div className="mt-2 line-clamp-2 text-[12px] text-[#697386]">{s.blurb}</div>}
              <div className="mt-4 flex gap-1.5 border-t border-[#EDF0F4] pt-3">
                <Btn variant="ghost" size="sm" onClick={() => setEditor(s)}><AdminIcon.Edit size={13} /> Edit</Btn>
                <Btn variant="ghost" size="sm" onClick={() => setConfirm(s)} className="!text-[#B3093C]"><AdminIcon.Trash size={13} /></Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editor && <SponsorEditor initial={editor} onClose={() => setEditor(null)} onSaved={() => { setEditor(null); load(); }} />}
      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={remove}
        busy={busy}
        danger
        title="Remove sponsor"
        body={`Remove “${confirm?.name}” from the showcase? This can’t be undone.`}
        confirmLabel="Remove sponsor"
      />
    </div>
  );
}
