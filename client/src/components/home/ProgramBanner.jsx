import { useNavigate } from 'react-router-dom';
import EvImage from '../common/EvImage';

export default function ProgramBanner() {
  const navigate = useNavigate();

  // Determine if live
  const start = new Date('2026-10-15');
  const end = new Date('2027-01-22');
  const today = new Date();
  const isLive = today >= start && today <= end;
  
  // Let's force a pill display for demonstration purposes if it's not live yet (e.g. Day 42 of 100)
  const displayDayPill = true; 

  return (
    <section className="mx-auto max-w-container px-4 pt-8 sm:px-6">
      <div 
        role="button"
        onClick={() => navigate('/program')}
        className="group relative overflow-hidden rounded-xl bg-black aspect-[16/6] md:aspect-[16/5] min-h-[220px] shadow-card transition hover:shadow-cardHover"
      >
        <EvImage 
          seed={100} 
          url="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600" 
          label="OBS 100 Days Program" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        <div className="absolute inset-y-0 left-0 z-10 flex flex-col justify-center p-6 sm:p-8 md:p-10 max-w-lg text-white">
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#C99E25] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              OBS 100 DAYS
            </span>
            {displayDayPill && (
              <span className="rounded bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Day 42 of 100
              </span>
            )}
          </div>
          
          <h2 className="mt-3 text-xl font-bold sm:text-2xl md:text-[28px] leading-tight">
            The 100 Days — 15 Oct to 22 Jan
          </h2>
          <p className="mt-1.5 text-xs text-white/85 sm:text-sm leading-relaxed">
            100 days of business events across the OBS world, every year.
          </p>

          <div className="mt-5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/program');
              }}
              className="rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-neutral-100"
            >
              View the agenda
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
