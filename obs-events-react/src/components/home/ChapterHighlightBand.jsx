import { useNavigate } from 'react-router-dom';

export default function ChapterHighlightBand() {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-container px-4 pt-8 sm:px-6">
      <div 
        className="relative overflow-hidden rounded-xl bg-gray-900 p-8 text-white shadow-panel bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-white/5 blur-xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="text-[12px] font-bold uppercase tracking-[1.5px] text-white/80">
            THE OBS NETWORK
          </span>
          <h2 className="mt-2 text-2xl font-black leading-tight sm:text-3xl lg:text-[34px]">
            108 chapters. One global business season.
          </h2>
          <p className="mt-2 max-w-xl text-sm font-medium text-white/90 sm:text-[15px]">
            Explore events by country, city, or interest — and start your own chapter.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/chapters')}
              className="rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-brand shadow-sm transition hover:scale-[1.02] hover:bg-brand-soft"
              style={{ color: '#8E6B1D' }}
            >
              Explore chapters
            </button>
            <button
              onClick={() => navigate('/chapters/create')}
              className="rounded-full border border-white/50 bg-white/10 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition hover:scale-[1.02] hover:bg-white/20"
            >
              Create a chapter
            </button>
          </div>

          {/* Numbers Strip */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 border-t border-white/20 pt-6 w-full max-w-2xl">
            <div className="flex flex-col items-center">
              <span className="text-xl font-extrabold sm:text-2xl">108</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/85 mt-0.5">Chapters</span>
            </div>
            <div className="h-8 w-px bg-white/20 hidden sm:block self-center" />
            <div className="flex flex-col items-center">
              <span className="text-xl font-extrabold sm:text-2xl">54</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/85 mt-0.5">Countries</span>
            </div>
            <div className="h-8 w-px bg-white/20 hidden sm:block self-center" />
            <div className="flex flex-col items-center">
              <span className="text-xl font-extrabold sm:text-2xl">100-Day</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/85 mt-0.5">Season</span>
            </div>
            <div className="h-8 w-px bg-white/20 hidden sm:block self-center" />
            <div className="flex flex-col items-center">
              <span className="text-xl font-extrabold sm:text-2xl">1,500+</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/85 mt-0.5">Events</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
