import { useState, useEffect } from 'react';
import { getLaunches } from '../../mock/api';
import EventCard from '../../components/common/EventCard';
import { SkeletonGrid } from '../../components/common/Skeleton';

export default function Launches() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming'); // upcoming | recent

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    getLaunches().then((data) => {
      setLaunches(data);
      setLoading(false);
    });
  }, []);

  const now = new Date();
  const upcoming = launches.filter((l) => l.launchAt && new Date(l.launchAt) > now);
  const recent = launches.filter((l) => !l.launchAt || new Date(l.launchAt) <= now);
  
  const displayed = tab === 'upcoming' ? upcoming : recent;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-16 pt-6">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <h1 className="text-3xl font-black text-ink">Launchpad</h1>
        <p className="mt-1 text-sm text-ink-mute">What's launching across the global One Business Season network.</p>

        {/* Tab Selection */}
        <div className="mt-6 flex border-b border-line mb-6 gap-6">
          <button
            onClick={() => setTab('upcoming')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              tab === 'upcoming' ? 'border-[#C99E25] text-[#C99E25]' : 'border-transparent text-ink-mute hover:text-ink'
            }`}
          >
            Upcoming Launches ({upcoming.length})
          </button>
          <button
            onClick={() => setTab('recent')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              tab === 'recent' ? 'border-[#C99E25] text-[#C99E25]' : 'border-transparent text-ink-mute hover:text-ink'
            }`}
          >
            Recently Launched ({recent.length})
          </button>
        </div>

        {/* Grid of Event Cards */}
        {loading ? (
          <SkeletonGrid />
        ) : displayed.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayed.map((e) => (
              <EventCard key={e.id} event={e} />
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
