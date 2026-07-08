import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getMyChapters } from '../../mock/api';

export default function MyChapters() {
  const navigate = useNavigate();
  const { user, setAuthOpen } = useApp();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user) {
      setLoading(true);
      getMyChapters(user.email).then((data) => {
        setChapters(data);
        setLoading(false);
      });
    }
  }, [user]);

  // Auth Gate Screen
  if (!user) {
    return (
      <div className="min-h-[70vh] bg-[#F5F5F5] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center bg-white border border-line p-8 rounded-xl shadow-sm">
          <span className="text-4xl">🔐</span>
          <h2 className="mt-4 text-xl font-bold text-ink">Sign In Required</h2>
          <p className="mt-2 text-sm text-ink-mute">
            You must be signed in to view your created chapters.
          </p>
          <button
            onClick={() => setAuthOpen(true)}
            className="mt-6 w-full rounded-full bg-brand py-2.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-dark transition-colors"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Live':
        return 'bg-success/10 text-success border-success/20';
      case 'Under review':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Hidden':
        return 'bg-neutral-100 text-neutral-500 border-neutral-200';
      default:
        return 'bg-neutral-100 text-neutral-500 border-neutral-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-16 pt-8">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-5 mb-8">
          <div>
            <h1 className="text-3xl font-black text-ink">My Chapters</h1>
            <p className="mt-1 text-sm text-ink-mute">Manage and review chapters you have submitted to the network.</p>
          </div>
          <button
            onClick={() => navigate('/chapters/create')}
            className="rounded-full bg-[#C99E25] hover:bg-[#A37E19] text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 shadow-sm transition"
          >
            ＋ Create New Chapter
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-32 rounded-xl" />
            ))}
          </div>
        ) : chapters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((c) => (
              <div key={c.slug} className="rounded-xl border border-line bg-white p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {c.flag ? (
                        <span className="text-3xl leading-none">{c.flag}</span>
                      ) : (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-soft text-sm font-bold text-brand uppercase">
                          {c.letter || c.name[0]}
                        </span>
                      )}
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-bold text-ink leading-tight">{c.name}</h2>
                        <span className="text-[10px] text-ink-mute font-semibold uppercase">{c.tier}</span>
                      </div>
                    </div>

                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold border uppercase leading-none ${getStatusColor(c.status)}`}>
                      {c.status}
                    </span>
                  </div>

                  <p className="mt-4 text-xs text-ink-soft leading-relaxed clamp-3">
                    {c.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-ink-mute font-medium">Owner: You</span>
                  <button 
                    onClick={() => pushToast('Editing is locked while chapter is under review', false)}
                    className="font-bold text-brand hover:underline"
                  >
                    Edit Info
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line bg-white py-16 text-center shadow-sm max-w-xl mx-auto">
            <span className="text-5xl">🌐</span>
            <h2 className="mt-4 text-lg font-bold text-ink">No Chapters Created</h2>
            <p className="mt-1.5 text-sm text-ink-mute max-w-xs mx-auto leading-relaxed">
              You haven't requested or created any chapters yet. Start one to build your regional or interest guild!
            </p>
            <button
              onClick={() => navigate('/chapters/create')}
              className="mt-6 rounded-full bg-[#C99E25] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#A37E19] transition"
            >
              Create your first chapter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
