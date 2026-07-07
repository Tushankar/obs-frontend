import EvImage from '../common/EvImage';

export default function SponsorLogo({ sponsor, large = false }) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (sponsor.website) {
      window.open(sponsor.website, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative overflow-hidden bg-white border border-line rounded-xl transition-all duration-200 hover:border-[#C99E25] hover:shadow-panel ${
        large ? 'w-[240px] h-[108px]' : 'w-[160px] h-[72px]'
      }`}
    >
      <div className="absolute inset-2">
        {/* We use object-contain for logos to preserve text aspect ratios */}
        {sponsor.logoUrl ? (
          <img
            src={sponsor.logoUrl}
            alt={sponsor.name}
            loading="lazy"
            className="w-full h-full object-contain filter grayscale opacity-70 transition-all duration-200 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface text-center p-1 text-[11px] font-bold text-ink-mute uppercase">
            {sponsor.name}
          </div>
        )}
      </div>
    </button>
  );
}
