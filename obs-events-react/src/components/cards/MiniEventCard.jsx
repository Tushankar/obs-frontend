import { useNavigate } from 'react-router-dom';
import EvImage from '../common/EvImage';

export default function MiniEventCard({ event }) {
  const navigate = useNavigate();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/event/${event.slug}`);
      }}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/event/${event.slug}`)}
      className="group flex w-[120px] shrink-0 cursor-pointer flex-col transition-transform duration-200 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-line bg-surface shadow-sm group-hover:border-brand">
        <EvImage seed={event.id} url={event.imageUrl} label={event.title} wmSize={24} />
        {event.chapter?.flag && (
          <span className="absolute right-1 top-1 z-[2] text-[12px] leading-none drop-shadow-sm">
            {event.chapter.flag}
          </span>
        )}
      </div>
      <div className="mt-1.5 flex flex-col gap-0.5 px-0.5">
        <h4 className="clamp-2 text-[11px] font-bold text-ink leading-tight group-hover:text-brand transition-colors">
          {event.title}
        </h4>
        <div className="text-[9px] text-ink-mute font-semibold uppercase tracking-wider">
          {event.city}
        </div>
      </div>
    </div>
  );
}
