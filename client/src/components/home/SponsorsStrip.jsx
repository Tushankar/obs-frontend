import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSponsors } from '../../mock/api';

export default function SponsorsStrip() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSponsors().then((data) => {
      // Group by tier
      const grp = data.reduce((acc, curr) => {
        if (!acc[curr.tier]) acc[curr.tier] = [];
        acc[curr.tier].push(curr);
        return acc;
      }, {});
      setGroups(grp);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-container px-4 pt-8 sm:px-6">
        <div className="skeleton mx-auto h-6 w-56 rounded mb-2" />
        <div className="skeleton mx-auto h-4 w-36 rounded mb-4" />
        <div className="skeleton h-12 w-full rounded" />
      </section>
    );
  }

  // Define display tiers
  const tiers = [
    { key: 'TITLE', label: 'Title Sponsors' },
    { key: 'TECHNOLOGY', label: 'Tech Partners' },
    { key: 'MEDIA', label: 'Media Partners' },
    { key: 'PARTNER', label: 'Community Partners' }
  ];

  return (
    <section className="mx-auto max-w-container px-4 pt-12 sm:px-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-ink sm:text-2xl">Our sponsors & partners</h2>
        <p className="mt-1 text-xs text-ink-mute">Powering the global business season across chapters.</p>
      </div>

      <div className="mt-8 flex flex-col gap-6 items-center justify-center">
        <div className="flex flex-wrap items-center justify-center gap-y-6 gap-x-12 w-full">
          {tiers.map((t) => {
            const list = groups[t.key] || [];
            if (list.length === 0) return null;
            return (
              <div key={t.key} className="flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-mute mb-2.5">
                  {t.label}
                </span>
                <div className="flex flex-wrap justify-center gap-3">
                  {list.slice(0, 4).map((sp) => (
                    <button
                      key={sp._id}
                      onClick={() => sp.website && window.open(sp.website, '_blank', 'noopener,noreferrer')}
                      className="flex h-16 w-36 items-center justify-center rounded-lg border border-line bg-white p-1.5 shadow-sm transition hover:border-[#C99E25] hover:shadow-panel"
                      title={sp.name}
                    >
                      <img
                        src={sp.logoUrl}
                        alt={sp.name}
                        className="max-h-full max-w-full object-contain filter grayscale opacity-70 transition-all duration-200 hover:grayscale-0 hover:opacity-100 hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => navigate('/become-a-sponsor')}
          className="mt-4 text-xs font-bold text-brand hover:text-brand-dark transition-colors flex items-center gap-0.5 group"
        >
          Become a sponsor / partner <span className="group-hover:translate-x-0.5 transition-transform">›</span>
        </button>
      </div>
    </section>
  );
}
