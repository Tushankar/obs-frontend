import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProgramDay } from '../../mock/api';
import EventCard from '../../components/common/EventCard';
import { SkeletonGrid } from '../../components/common/Skeleton';
import { Icon } from '../../components/common/Icon';

export default function ProgramDay() {
  const { n } = useParams();
  const navigate = useNavigate();
  const [dayData, setDayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState('All');

  useEffect(() => {
    setLoading(true);
    getProgramDay(n, country).then((data) => {
      setDayData(data);
      setLoading(false);
    });
  }, [n, country]);

  const countries = [
    { name: 'All', flag: '🌍' },
    { name: 'India', flag: '🇮🇳' },
    { name: 'UAE', flag: '🇦🇪' },
    { name: 'Singapore', flag: '🇸🇬' },
    { name: 'USA', flag: '🇺🇸' },
    { name: 'UK', flag: '🇬🇧' }
  ];

  const handlePrev = () => {
    const prev = parseInt(n) - 1;
    if (prev >= 1) navigate(`/program/day/${prev}`);
  };

  const handleNext = () => {
    const next = parseInt(n) + 1;
    if (next <= 100) navigate(`/program/day/${next}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-12">
      {/* Header Area */}
      <div className="bg-white border-b border-line py-8 shadow-sm">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <button 
            onClick={() => navigate('/program')}
            className="text-xs font-bold text-brand hover:underline flex items-center gap-1 mb-3"
          >
            ← Back to Agenda
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-brand text-white font-bold text-xs uppercase px-2.5 py-0.5 rounded leading-none">
                  Day {n} of 100
                </span>
                <span className="text-sm font-bold text-ink-mute">
                  {dayData?.date}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-ink mt-2">
                {dayData?.theme || 'Day Agenda'}
              </h1>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                disabled={parseInt(n) <= 1}
                onClick={handlePrev}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-ink-soft transition hover:border-brand hover:text-brand disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink-soft"
                aria-label="Previous day"
              >
                <Icon.ChevronDown className="rotate-90" width={14} height={14} />
              </button>
              <button
                disabled={parseInt(n) >= 100}
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-ink-soft transition hover:border-brand hover:text-brand disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink-soft"
                aria-label="Next day"
              >
                <Icon.ChevronDown className="-rotate-90" width={14} height={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-container px-4 pt-8 sm:px-6">
        {/* Country Selector */}
        <div className="flex flex-wrap items-center gap-2 mb-6 bg-white border border-line p-3 rounded-lg shadow-sm">
          <span className="text-xs font-bold text-ink-mute uppercase mr-1">Filter by Country:</span>
          {countries.map((c) => (
            <button
              key={c.name}
              onClick={() => setCountry(c.name)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                country === c.name
                  ? 'border-brand bg-brand-soft text-brand'
                  : 'border-line bg-surface text-ink-soft hover:bg-neutral-100'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {loading ? (
          <SkeletonGrid />
        ) : dayData?.events && dayData.events.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {dayData.events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line bg-white py-16 text-center shadow-sm">
            <span className="text-4xl">🗓️</span>
            <h3 className="mt-4 text-base font-bold text-ink">No events scheduled</h3>
            <p className="mt-1 text-sm text-ink-mute max-w-xs mx-auto">
              There are no events scheduled for Day {n} in {country === 'All' ? 'any country' : country}.
            </p>
            <button 
              onClick={() => navigate('/list-your-event')}
              className="mt-6 rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-dark transition-colors"
            >
              Host an event on this day
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
