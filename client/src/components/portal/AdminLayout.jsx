import { Outlet } from 'react-router-dom';
import AdminShell from '../admin/AdminShell';

// Admin portal chrome — standalone Stripe-style shell (no public navbar/footer).
// Nav lives in AdminShell.
export default function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
