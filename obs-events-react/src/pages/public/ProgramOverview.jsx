import { useState, useEffect, useRef } from 'react';
import { getProgram } from '../../mock/api';
import MiniEventCard from '../../components/cards/MiniEventCard';
import { SkeletonRail } from '../../components/common/Skeleton';
import { useNavigate } from 'react-router-dom';

export default function ProgramOverview() {
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countryFilter, setCountryFilter] = useState('All');
  const [visibleLimit, setVisibleLimit] = useState(20);
  const agendaRefs = useRef({});

  useEffect(() => {
    window.scrollTo(0, 0);
    getProgram().then((data) => {
      setProgram(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-container px-4 py-8 sm:px-6">
        <div className="skeleton h-[200px] w-full rounded-xl mb-8" />
        <div className="skeleton h-10 w-64 rounded mb-6" />
        <div className="skeleton h-64 w-full rounded" />
      </div>
    );
  }

  // Country flags map
  const countries = [
    { name: 'All', flag: '🌍' },
    { name: 'India', flag: '🇮🇳' },
    { name: 'UAE', flag: '🇦🇪' },
    { name: 'Singapore', flag: '🇸🇬' },
    { name: 'USA', flag: '🇺🇸' },
    { name: 'UK', flag: '🇬🇧' }
  ];

  // Helper to filter events inside the day rows
  const getFilteredEventsForDay = (dayNum) => {
    // sprinkle events across ~40 days
    // Let's grab events from event list that belong to this day
    const allEvents = [
      { id: 1, title: 'OBS India Investor Summit 2026', city: 'Mumbai', slug: 'obs-india-investor-summit-2026', programDayNumber: 12, chapter: { flag: '🇮🇳' } },
      { id: 2, title: 'Founders Networking Night', city: 'Bengaluru', slug: 'founders-networking-night', programDayNumber: 1, chapter: { flag: '🇮🇳' } },
      { id: 4, title: 'Scale-Up Playbook Workshop', city: 'Delhi NCR', slug: 'scale-up-playbook-workshop', programDayNumber: 6, chapter: { flag: '🇮🇳' } },
      { id: 9, title: 'Startup Pitch Arena', city: 'Mumbai', slug: 'startup-pitch-arena', programDayNumber: 11, chapter: { flag: '🇮🇳' } },
      { id: 12, title: 'OBS Global Leadership Conference', city: 'Singapore', slug: 'obs-global-leadership-conference', programDayNumber: 42, chapter: { flag: '🇸🇬' } }
    ];

    // dynamically generate others to make it look full (sprinkling across ~40 days)
    // we can generate a consistent set
    const daySeed = (dayNum * 17) % 100;
    if (daySeed < 40 && dayNum !== 12 && dayNum !== 1 && dayNum !== 6 && dayNum !== 11 && dayNum !== 42) {
      const citiesList = ['Mumbai', 'Delhi NCR', 'Dubai', 'London', 'Singapore', 'New York'];
      const city = citiesList[dayNum % citiesList.length];
      const flagMap = { Mumbai: '🇮🇳', 'Delhi NCR': '🇮🇳', Dubai: '🇦🇪', London: '🇬🇧', Singapore: '🇸🇬', 'New York': '🇺🇸' };
      allEvents.push({
        id: 100 + dayNum,
        title: `OBS Day ${dayNum} Special Session`,
        city,
        slug: `obs-day-${dayNum}-special-session`,
        programDayNumber: dayNum,
        chapter: { flag: flagMap[city] || '🌐' }
      });
    }

    let results = allEvents.filter(e => e.programDayNumber === dayNum);
    if (countryFilter !== 'All') {
      results = results.filter(e => {
        const flagMap = { India: '🇮🇳', UAE: '🇦🇪', Singapore: '🇸🇬', USA: '🇺🇸', UK: '🇬🇧' };
        return e.chapter.flag === flagMap[countryFilter];
      });
    }
    return results;
  };

  const scrollToDay = (dayNum) => {
    agendaRefs.current[dayNum]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (dayNum > visibleLimit) {
      setVisibleLimit(Math.min(100, dayNum + 10));
    }
  };

  return (
    <div className="pb-12 bg-[#F5F5F5]">
      {/* Hero Band */}
      <div className="relative overflow-hidden bg-gold-gradient py-12 text-white shadow-sm">
        <div className="mx-auto max-w-container px-4 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
          <div>
            <span className="rounded bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
              15 October → 22 January
            </span>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl lg:text-[42px] leading-none">
              OBS 100 Days Program
            </h1>
            <p className="mt-2.5 max-w-xl text-sm text-white/90 leading-relaxed">
              100 consecutive days of business summits, masterclasses, networking nights, and launches across the global OBS network.
            </p>
          </div>

          <div className="mt-6 md:mt-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 md:w-80">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/80">Season Status</div>
            <div className="text-xl font-bold mt-1">{program.seasonStatus}</div>
            
            {/* Slim progress bar */}
            {program.currentDay && (
              <div className="mt-3">
                <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${program.progressPct}%` }}
                  />
                </div>
                <div className="mt-1 text-[10px] text-right text-white/70 font-semibold">{program.progressPct}% Complete</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-container px-4 pt-8 sm:px-6 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 items-start">
        {/* Main Content Area */}
        <div>
          {/* Country filter chips */}
          <div className="flex flex-wrap items-center gap-2 mb-6 bg-white border border-line p-3 rounded-lg shadow-sm">
            <span className="text-xs font-bold text-ink-mute uppercase mr-1">Filter by Country:</span>
            {countries.map((c) => (
              <button
                key={c.name}
                onClick={() => setCountryFilter(c.name)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  countryFilter === c.name
                    ? 'border-brand bg-brand-soft text-brand'
                    : 'border-line bg-surface text-ink-soft hover:bg-neutral-100'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          {/* Day-by-Day Agenda */}
          <div className="flex flex-col gap-4">
            {program.days.slice(0, visibleLimit).map((day) => {
              const events = getFilteredEventsForDay(day.dayNumber);
              const isToday = day.dayNumber === 42; // let's mock today as Day 42

              return (
                <div
                  key={day.dayNumber}
                  ref={(el) => (agendaRefs.current[day.dayNumber] = el)}
                  className={`rounded-xl border bg-white p-5 shadow-sm transition-all duration-200 ${
                    isToday 
                      ? 'border-[#C99E25] border-l-[6px] shadow-md' 
                      : 'border-line hover:border-brand'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[12px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        isToday ? 'bg-[#C99E25] text-white' : 'bg-surface text-ink-soft'
                      }`}>
                        Day {day.dayNumber}
                      </span>
                      <span className="text-xs text-ink-mute font-bold">{day.date}</span>
                      {isToday && (
                        <span className="text-[10px] font-black uppercase text-[#C99E25] tracking-wider animate-pulse">
                          ● Today
                        </span>
                      )}
                    </div>
                    <div className="text-[13px] font-bold text-ink leading-tight">
                      {day.theme}
                    </div>
                  </div>

                  <div className="pt-4">
                    {events.length > 0 ? (
                      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1">
                        {events.map((e) => (
                          <MiniEventCard key={e.id} event={e} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-ink-mute">
                        <span>No events scheduled yet for this day.</span>
                        <button 
                          onClick={() => navigate('/list-your-event')}
                          className="font-bold text-brand hover:underline"
                        >
                          ＋ Add an event
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {visibleLimit < 100 && (
              <button
                onClick={() => setVisibleLimit((v) => Math.min(100, v + 20))}
                className="mt-4 w-full py-3 bg-white border border-line rounded-xl text-sm font-bold text-brand hover:border-brand hover:bg-brand-soft transition"
              >
                Load more days
              </button>
            )}
          </div>
        </div>

        {/* Desktop Sticky Sidebar Navigation */}
        <aside className="sticky top-[90px] hidden lg:block bg-white border border-line rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4 border-b border-line pb-2">Jump to Week</h3>
          <div className="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto no-scrollbar">
            <button onClick={() => scrollToDay(1)} className="text-left text-xs font-semibold text-ink-soft hover:text-brand py-1 border-b border-neutral-50">Week 1 (Day 1)</button>
            <button onClick={() => scrollToDay(15)} className="text-left text-xs font-semibold text-ink-soft hover:text-brand py-1 border-b border-neutral-50">Week 3 (Day 15)</button>
            <button onClick={() => scrollToDay(30)} className="text-left text-xs font-semibold text-ink-soft hover:text-brand py-1 border-b border-neutral-50">Week 5 (Day 30)</button>
            <button onClick={() => scrollToDay(42)} className="text-left text-xs font-bold text-[#C99E25] py-1 border-b border-neutral-50 flex items-center justify-between">
              <span>Today (Day 42)</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#C99E25]" />
            </button>
            <button onClick={() => scrollToDay(50)} className="text-left text-xs font-semibold text-ink-soft hover:text-brand py-1 border-b border-neutral-50">Week 8 (Day 50)</button>
            <button onClick={() => scrollToDay(70)} className="text-left text-xs font-semibold text-ink-soft hover:text-brand py-1 border-b border-neutral-50">Week 10 (Day 70)</button>
            <button onClick={() => scrollToDay(100)} className="text-left text-xs font-semibold text-ink-soft hover:text-brand py-1 border-b border-neutral-50">Week 15 (Day 100)</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
