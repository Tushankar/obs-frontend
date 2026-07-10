import { useState, useEffect } from 'react';
import api from '../../lib/api';
import ApiEventCard from '../../components/common/ApiEventCard';
import { SkeletonGrid } from '../../components/common/Skeleton';

// Live countdown to a target date.
function Countdown({ target }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!target) return null;
  const ms = new Date(target).getTime() - now;
  if (ms <= 0) return <span className="text-[11px] font-bold uppercase tracking-wider text-success">● Live now</span>;
  const d = Math.floor(ms / 864e5);
  const h = Math.floor((ms % 864e5) / 36e5);
  const m = Math.floor((ms % 36e5) / 6e4);
  const s = Math.floor((ms % 6e4) / 1000);
  return (
    <span className="font-mono text-[12px] font-bold text-[#C99E25]">
      {d > 0 && `${d}d `}{String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  );
}

export default function Launches() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming'); // upcoming | recent

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    api.launches(tab)
      .then((data) => setLaunches(Array.isArray(data) ? data : []))
      .catch(() => setLaunches([]))
      .finally(() => setLoading(false));
  }, [tab]);

  const tabs = [['upcoming', 'Upcoming launches'], ['recent', 'Recently launched']];

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-16 pt-6">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <h1 className="text-3xl font-black text-ink">Launchpad</h1>
        <p className="mt-1 text-sm text-ink-mute">What&apos;s launching across the global One Business Season network.</p>

        <div className="mb-6 mt-6 flex gap-6 border-b border-line">
          {tabs.map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} className={`border-b-2 pb-3 text-sm font-bold transition-all ${tab === key ? 'border-[#C99E25] text-[#C99E25]' : 'border-transparent text-ink-mute hover:text-ink'}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : launches.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {launches.map((e) => (
              <div key={e.id} className="flex flex-col gap-2">
                <ApiEventCard event={e} />
                {tab === 'upcoming' && (
                  <div className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink-mute">🚀 Launches in</span>
                    <Countdown target={e.launchAt || e.startAt} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line bg-white py-16 text-center shadow-sm">
            <span className="text-4xl">🚀</span>
            <h3 className="mt-4 text-base font-bold text-ink">No launches found</h3>
            <p className="mt-1 text-sm text-ink-mute max-w-xs mx-auto">
              There are no {tab === 'upcoming' ? 'upcoming launch events' : 'recent launches'} listed currently.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
