import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EvImage from '../components/common/EvImage';
import { getChapterGroups, slugify } from '../data/events';
import { getChapters } from '../mock/api';

export default function Chapters() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [communityChapters, setCommunityChapters] = useState([]);
  
  const groups = getChapterGroups();

  useEffect(() => {
    window.scrollTo(0, 0);
    getChapters().then(({ community }) => {
      // Only display Community chapters that are Live
      setCommunityChapters(community.filter((c) => c.status === 'Live'));
      setLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-container px-4 pb-12 pt-6 sm:px-6">
      {/* Page Header with persistent Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink">OBS Chapters</h1>
          <p className="text-xs text-ink-mute">Join regional or interest-based community hubs worldwide.</p>
        </div>
        <button
          onClick={() => navigate('/chapters/create')}
          className="rounded-full bg-[#C99E25] hover:bg-[#A37E19] text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 shadow-sm transition self-start sm:self-center"
        >
          ＋ Create a Chapter
        </button>
      </div>

      {/* Banner */}
      <div className="relative aspect-[16/5] min-h-[180px] overflow-hidden rounded-xl">
        <EvImage seed={7} url="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1800&auto=format&fit=crop" label="OBS chapters" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-black/10" />
        <div className="absolute left-6 top-1/2 z-[2] -translate-y-1/2 sm:left-8">
          <div className="text-2xl font-bold text-white sm:text-[28px]">108 chapters worldwide</div>
          <div className="mt-1.5 text-sm text-white/90">Find your community — by country, city, or theme.</div>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-[10px]" />)}
        </div>
      ) : (
        <>
          {groups.map((g) => (
            <section key={g.title} className="mt-8">
              <h2 className="mb-4 text-lg font-bold text-ink border-b border-line pb-2">{g.title}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {g.items.map((c) => (
                  <button key={c.name} onClick={() => navigate(`/chapters/${slugify(c.name)}`)} className="flex items-center gap-3 rounded-[10px] border border-line bg-white p-3.5 text-left transition hover:-translate-y-0.5 hover:border-brand hover:shadow-panel">
                    {c.flag ? <span className="shrink-0 text-3xl leading-none">{c.flag}</span> : <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-soft text-sm font-bold text-brand">{c.letter}</span>}
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-ink">{c.name}</div>
                      <div className="mt-0.5 text-xs text-ink-mute">{c.tier} · {c.count} events</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}

          {/* Community Chapters Section */}
          {communityChapters.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 text-lg font-bold text-ink border-b border-line pb-2">Community Chapters</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {communityChapters.map((c) => (
                  <button key={c.slug} onClick={() => navigate(`/chapters/${c.slug}`)} className="flex items-center gap-3 rounded-[10px] border border-line bg-white p-3.5 text-left transition hover:-translate-y-0.5 hover:border-brand hover:shadow-panel">
                    {c.flag ? (
                      <span className="shrink-0 text-3xl leading-none">{c.flag}</span>
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-soft text-sm font-bold text-brand uppercase">
                        {c.letter || c.name[0]}
                      </span>
                    )}
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-ink">{c.name}</div>
                      <div className="mt-0.5 text-xs text-ink-mute">Community · {c.status}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
