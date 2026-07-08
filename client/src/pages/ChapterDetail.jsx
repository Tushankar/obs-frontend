import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiEventCard from '../components/common/ApiEventCard';
import Seo from '../components/common/Seo';
import { useApp } from '../context/AppContext';
import api, { apiError } from '../lib/api';

export default function ChapterDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, setAuthOpen, pushToast } = useApp();
  const [data, setData] = useState(undefined); // { chapter, memberCount, isMember, events }
  const [tab, setTab] = useState('events');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    window.scrollTo(0, 0);
    setData(undefined);
    api.chapter(slug).then((d) => { if (alive) setData(d); }).catch(() => { if (alive) setData(null); });
    return () => { alive = false; };
  }, [slug, user]); // refetch on sign-in so isMember reflects the session

  if (data === undefined) return <div className="mx-auto max-w-container px-6 py-24 text-center text-ink-mute">Loading chapter…</div>;
  if (data === null) {
    return (
      <div className="mx-auto max-w-container px-6 py-20 text-center text-ink-mute">
        Chapter not found. <button onClick={() => navigate('/chapters')} className="text-brand underline">All chapters</button>
      </div>
    );
  }

  const { chapter, events } = data;

  async function toggle() {
    if (!user) { setAuthOpen(true); return; }
    setBusy(true);
    try {
      const res = data.isMember ? await api.leaveChapter(chapter.id) : await api.joinChapter(chapter.id);
      setData((d) => ({ ...d, isMember: res.joined, memberCount: res.memberCount }));
      pushToast(res.joined ? `Welcome to ${chapter.name}!` : `Left ${chapter.name}`);
    } catch (e) {
      pushToast(apiError(e, 'Could not update membership'), false);
    } finally {
      setBusy(false);
    }
  }

  const tabCls = (active) => `pb-2.5 text-sm font-semibold cursor-pointer border-b-2 transition ${active ? 'border-brand text-brand' : 'border-transparent text-ink-soft'}`;
  const facts = [
    ['Type', chapter.type.replace(/_/g, ' ').toLowerCase()],
    ['Tier', chapter.tier || '—'],
    ['Members', String(data.memberCount)],
    ['Status', chapter.isOfficial ? 'Official' : 'Community'],
  ];

  return (
    <div className="mx-auto max-w-container px-4 pb-10 pt-6 sm:px-6">
      <Seo title={`OBS ${chapter.name} Chapter`} description={chapter.description || `Join the OBS ${chapter.name} chapter and discover its events.`} />

      <div className="flex flex-wrap items-center gap-[18px]">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-4xl">
          {chapter.flagEmoji ? chapter.flagEmoji : <span className="text-[28px] font-extrabold text-brand">{chapter.name[0]}</span>}
        </div>
        <div className="min-w-[200px] flex-1">
          <h1 className="text-2xl font-bold text-ink sm:text-[26px]">{chapter.name}</h1>
          <div className="mt-1 text-[13px] text-ink-mute">
            {data.memberCount} member{data.memberCount === 1 ? '' : 's'}{chapter.tier ? ` · ${chapter.tier}` : ''}{chapter.isOfficial ? ' · Official' : ''}
          </div>
        </div>
        <button onClick={toggle} disabled={busy} className={`rounded-md px-[22px] py-2.5 text-sm font-semibold transition disabled:opacity-60 ${data.isMember ? 'border border-brand bg-white text-brand' : 'bg-brand text-white hover:bg-brand-dark'}`}>
          {data.isMember ? 'Joined ✓' : 'Join chapter'}
        </button>
      </div>

      <div className="mt-6 flex gap-6 border-b border-line">
        <button onClick={() => setTab('events')} className={tabCls(tab === 'events')}>Events ({events.length})</button>
        <button onClick={() => setTab('about')} className={tabCls(tab === 'about')}>About</button>
      </div>

      {tab === 'events' ? (
        events.length ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4 xl:gap-6">
            {events.map((e) => <ApiEventCard key={e.id} event={e} />)}
          </div>
        ) : (
          <div className="mt-10 text-center text-sm text-ink-mute">No upcoming events in this chapter yet.</div>
        )
      ) : (
        <div className="mt-6 max-w-[640px]">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
            {chapter.description || `${chapter.name} brings together the OBS community for curated events, roundtables and networking.`}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {facts.map(([k, v]) => (
              <div key={k} className="rounded-[10px] border border-line p-3.5">
                <div className="text-xs text-ink-mute">{k}</div>
                <div className="mt-1 text-base font-semibold capitalize text-ink">{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
