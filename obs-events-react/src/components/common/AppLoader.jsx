import { useEffect, useState } from 'react';

export default function AppLoader({ ready }) {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (ready) {
      const t1 = setTimeout(() => setVisible(false), 200); // start fade out
      const t2 = setTimeout(() => setMounted(false), 550); // unmount
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [ready]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center">
        <span 
          className="font-serif text-[44px] font-black tracking-tight text-brand leading-none" 
          style={{ fontFamily: 'Georgia, serif', color: '#C99E25' }}
        >
          OBS
        </span>
        <span className="mt-2 text-[11px] font-semibold tracking-wider text-ink-mute uppercase">
          One Business Season
        </span>
        
        {/* Staggered 3-dot bounce */}
        <div className="mt-8 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#C99E25] animate-loader-bounce" style={{ animationDelay: '0s' }} />
          <div className="h-2 w-2 rounded-full bg-[#C99E25] animate-loader-bounce" style={{ animationDelay: '0.15s' }} />
          <div className="h-2 w-2 rounded-full bg-[#C99E25] animate-loader-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
      <style>{`
        @keyframes loaderBounce {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
        .animate-loader-bounce {
          animation: loaderBounce 1.4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
