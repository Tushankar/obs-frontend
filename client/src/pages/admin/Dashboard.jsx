import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { apiError } from '../../lib/api';
import { useApp } from '../../context/AppContext';
import { PageHead, Card, StatCard, StatGrid, Loading, formatPrice } from '../../components/portal/Kit';
import { AdminIcon } from '../../components/admin/AdminIcons';

const ACTIONS = [
  ['Organizers', 'Review applications', '/admin/organizers', 'Organizers'],
  ['Events', 'Moderation queue', '/admin/events', 'Events'],
  ['Refunds', 'Pending requests', '/admin/refunds', 'Refunds'],
  ['Transactions', 'Payment activity', '/admin/transactions', 'Transactions'],
  ['Hero carousel', 'Home page banners', '/admin/hero', 'Hero'],
  ['Site pages', 'Terms, privacy, about', '/admin/cms', 'Cms'],
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { pushToast } = useApp();
  const [kpis, setKpis] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    api.adminDashboard().then(setKpis).catch((e) => pushToast(apiError(e), false));
  }, [pushToast]);

  return (
    <div>
      <PageHead title="Dashboard" subtitle="Platform overview at a glance." />

      {kpis === null ? (
        <Loading />
      ) : (
        <StatGrid>
          <StatCard label="Users" value={kpis.users} icon={<AdminIcon.Users size={16} />} />
          <StatCard label="Organizers" value={kpis.organizers} icon={<AdminIcon.Organizers size={16} />} />
          <StatCard label="Gross revenue" value={formatPrice(kpis.grossRevenue, kpis.currency)} icon={<AdminIcon.Transactions size={16} />} hint={`${kpis.paidOrders} paid orders`} />
          <StatCard label="Live events" value={kpis.publishedEvents} icon={<AdminIcon.Events size={16} />} hint={`${kpis.pendingApprovals} awaiting review`} />
        </StatGrid>
      )}

      <div className="mt-6">
        <div className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[#697386]">Quick actions</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIONS.map(([label, desc, to, icon]) => {
            const Ic = AdminIcon[icon];
            return (
              <Card
                key={to}
                role="button"
                tabIndex={0}
                onClick={() => navigate(to)}
                onKeyDown={(e) => e.key === 'Enter' && navigate(to)}
                className="group cursor-pointer p-4 transition hover:border-[#C9D2DE] hover:shadow-[0_4px_12px_rgba(26,31,54,.08)]"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#F7F1DE] text-[#8E6B1D]"><Ic size={17} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-semibold text-[#1A1F36]">{label}</div>
                    <div className="truncate text-[12px] text-[#8792A2]">{desc}</div>
                  </div>
                  <AdminIcon.ChevronRight size={14} className="shrink-0 text-[#C4CBD8] transition group-hover:translate-x-0.5 group-hover:text-[#8792A2]" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
