import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '../components/common/Icon';
import api, { apiErrorCode } from '../lib/api';

const fmtDate = (d) => (d ? new Date(d).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : null);

// Public scan page for ${APP_URL}/t/:token — read-only status (check-in is the
// organizer scanner in Phase 3).
export default function Validate() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    let alive = true;
    window.scrollTo(0, 0);
    api.validateTicket(token)
      .then((t) => { if (alive) setState({ loading: false, ticket: t }); })
      .catch((e) => { if (alive) setState({ loading: false, notFound: apiErrorCode(e) === 'TICKET_NOT_FOUND', error: true }); });
    return () => { alive = false; };
  }, [token]);

  let view;
  if (state.loading) view = { bg: 'bg-ink-mute', icon: 'clock', title: 'Checking ticket…', sub: '' };
  else if (state.notFound || !state.ticket) view = { bg: 'bg-brand-red', icon: 'x', title: 'Ticket not found', sub: 'Ask the attendee to open their latest ticket email.' };
  else {
    const t = state.ticket;
    const sub = [t.eventTitle, t.attendeeName && `Attendee ${t.attendeeName}`].filter(Boolean).join(' · ');
    if (t.status === 'VALID') view = { bg: 'bg-success', icon: 'check', title: 'Valid ticket', sub, meta: fmtDate(t.startAt), ticketNumber: t.ticketNumber };
    else if (t.status === 'USED') view = { bg: 'bg-ink-mute', icon: 'clock', title: `Already checked in${t.checkedInAt ? ` at ${fmtDate(t.checkedInAt)}` : ''}`, sub, ticketNumber: t.ticketNumber };
    else view = { bg: 'bg-brand-red', icon: 'x', title: `Ticket ${t.status.toLowerCase()}`, sub, ticketNumber: t.ticketNumber };
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-[400px] rounded-2xl bg-white p-9 text-center shadow-[0_8px_30px_rgba(0,0,0,.1)]">
        <div className={`mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full text-white ${view.bg} ${state.loading ? '' : 'animate-scaleIn'}`}>
          {view.icon === 'check' && <Icon.Check width={34} height={34} />}
          {view.icon === 'clock' && <Icon.Clock width={34} height={34} />}
          {view.icon === 'x' && <Icon.X width={34} height={34} />}
        </div>
        <div className="mt-5 text-[22px] font-bold text-ink">{view.title}</div>
        {view.sub && <div className="mt-2 text-sm leading-relaxed text-ink-mute">{view.sub}</div>}
        {view.meta && <div className="mt-1 text-[13px] text-ink-mute">{view.meta}</div>}
        {view.ticketNumber && <div className="mt-3 font-mono text-[12px] text-ink-faint">{view.ticketNumber}</div>}
        <div className="my-6 h-px bg-line" />
        <button onClick={() => navigate('/')} className="text-[13px] font-medium text-brand">Back to OBS Events</button>
      </div>
    </div>
  );
}
