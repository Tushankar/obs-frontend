import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeakerCard from '../cards/SpeakerCard';
import { getSpeakers } from '../../mock/api';
import { Icon } from '../common/Icon';

export default function SpeakersRail() {
  const navigate = useNavigate();
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const railRef = useRef(null);

  useEffect(() => {
    getSpeakers().then((data) => {
      // Show featured speakers or just a selection
      setSpeakers(data.slice(0, 8));
      setLoading(false);
    });
  }, []);

  const scroll = (dir) => {
    if (railRef.current) {
      const amt = dir === 'l' ? -320 : 320;
      railRef.current.scrollBy({ left: amt, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-container px-4 pt-8 sm:px-6">
        <div className="skeleton mb-4 h-6 w-48 rounded" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton aspect-square h-48 w-48 shrink-0 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (speakers.length === 0) return null;

  return (
    <section className="group/rail mx-auto max-w-container px-4 pt-8 sm:px-6 relative">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink sm:text-2xl">Featured Speakers</h2>
          <p className="text-xs text-ink-mute">Learn from global founders, creators, and operators.</p>
        </div>
        <button
          onClick={() => navigate('/speakers')}
          className="text-xs font-semibold text-brand hover:text-brand-dark transition-colors flex items-center gap-0.5"
        >
          See all <Icon.ChevronRight className="inline" width={10} height={10} />
        </button>
      </div>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('l')}
          className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white p-2.5 shadow-pop transition hover:scale-105 active:scale-95 group-hover/rail:lg:flex"
          aria-label="Scroll left"
        >
          <Icon.ChevronDown className="rotate-90 text-ink-soft" width={12} height={12} />
        </button>

        {/* Horizontal scroll container */}
        <div
          ref={railRef}
          className="no-scrollbar flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory"
        >
          {speakers.map((s) => (
            <div key={s._id} className="w-[180px] sm:w-[200px] md:w-[220px] shrink-0 snap-start">
              <SpeakerCard speaker={s} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('r')}
          className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white p-2.5 shadow-pop transition hover:scale-105 active:scale-95 group-hover/rail:lg:flex"
          aria-label="Scroll right"
        >
          <Icon.ChevronDown className="-rotate-90 text-ink-soft" width={12} height={12} />
        </button>
      </div>
    </section>
  );
}
