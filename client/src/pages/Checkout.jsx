import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EvImage from '../components/common/EvImage';
import { seedOf } from '../components/common/ApiEventCard';
import StripePaymentForm from '../components/checkout/StripePaymentForm';
import { Icon } from '../components/common/Icon';
import { useApp } from '../context/AppContext';
import api, { apiError, apiErrorCode } from '../lib/api';
import { loadScript } from '../lib/loadScript';

const money = (paise, currency = 'INR') => {
  const sym = currency === 'INR' ? '₹' : `${currency} `;
  return sym + (Number(paise) / 100).toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US');
};
const RZP_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

export default function Checkout() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, pushToast } = useApp();
  const [order, setOrder] = useState(undefined); // undefined=loading, null=not found
  const [left, setLeft] = useState(null);
  const [gateway, setGateway] = useState(null);
  const [paying, setPaying] = useState(false);
  const [stripe, setStripe] = useState(null); // { clientSecret, publishableKey }

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const load = useCallback(() => {
    api.myOrder(orderId)
      .then((o) => {
        setOrder(o);
        if (o.status === 'PAID') navigate(`/checkout/${orderId}/success`, { replace: true });
        setGateway(o.currency === 'INR' ? 'razorpay' : 'stripe');
      })
      .catch(() => setOrder(null));
  }, [orderId, navigate]);
  useEffect(() => { load(); }, [load]);

  // Live countdown from expiresAt.
  useEffect(() => {
    if (!order?.expiresAt || order.status !== 'PENDING') return;
    const tick = () => setLeft(Math.max(0, Math.round((new Date(order.expiresAt).getTime() - Date.now()) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [order]);

  if (order === undefined) return <div className="mx-auto max-w-container px-6 py-24 text-center text-ink-mute">Loading checkout…</div>;
  if (order === null) {
    return (
      <div className="mx-auto max-w-container px-6 py-20 text-center text-ink-mute">
        Order not found. <button onClick={() => navigate('/events')} className="text-brand underline">Browse events</button>
      </div>
    );
  }

  const ev = order.event || {};
  const expired = order.status === 'EXPIRED' || left === 0;
  const notPayable = ['CANCELLED', 'FAILED', 'REFUNDED', 'REFUND_REQUESTED'].includes(order.status);
  const mm = left != null ? Math.floor(left / 60) : 0;
  const ss = left != null ? String(left % 60).padStart(2, '0') : '00';
  const urgent = left != null && left < 180;

  async function payRazorpay() {
    setPaying(true);
    try {
      const r = await api.razorpayCreateOrder(orderId);
      await loadScript(RZP_SCRIPT);
      const rzp = new window.Razorpay({
        key: r.keyId,
        order_id: r.razorpayOrderId,
        amount: r.amount,
        currency: r.currency,
        name: 'OBS Events',
        description: ev.title,
        prefill: { name: user?.name, email: user?.email },
        handler: async (resp) => {
          try {
            await api.razorpayVerify({ orderId, razorpay_order_id: resp.razorpay_order_id, razorpay_payment_id: resp.razorpay_payment_id, razorpay_signature: resp.razorpay_signature });
          } catch { /* verify is a fast-path; webhook confirms regardless */ }
          navigate(`/checkout/${orderId}/success`);
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      rzp.open();
    } catch (e) {
      setPaying(false);
      pushToast(apiErrorCode(e) === 'RAZORPAY_NOT_CONFIGURED' ? 'Razorpay isn’t configured in this environment (test keys needed).' : apiError(e, 'Could not start payment'), false);
    }
  }

  async function payStripe() {
    setPaying(true);
    try {
      const r = await api.stripeIntent(orderId);
      setStripe({ clientSecret: r.clientSecret, publishableKey: r.publishableKey });
    } catch (e) {
      pushToast(apiErrorCode(e) === 'STRIPE_NOT_CONFIGURED' ? 'Stripe isn’t configured in this environment (test keys needed).' : apiError(e, 'Could not start payment'), false);
    } finally {
      setPaying(false);
    }
  }

  const gwCard = (id, title, sub) => (
    <button onClick={() => { setGateway(id); setStripe(null); }} className={`flex w-full items-center gap-3 rounded-[10px] border p-4 text-left transition ${gateway === id ? 'border-brand bg-brand-soft' : 'border-line'}`}>
      <span className={`h-4 w-4 shrink-0 rounded-full ${gateway === id ? 'border-[5px] border-brand' : 'border-2 border-ink-faint'}`} />
      <span><span className="block text-sm font-semibold text-ink">{title}</span><span className="mt-0.5 block text-xs text-ink-mute">{sub}</span></span>
    </button>
  );

  return (
    <div className="mx-auto max-w-container px-4 pb-10 pt-6 sm:px-6">
      <button onClick={() => navigate(ev.slug ? `/event/${ev.slug}` : '/events')} className="mb-4 flex items-center gap-1.5 text-[13px] font-medium text-ink-mute transition hover:text-brand"><Icon.ChevronLeft width={12} height={12} /> Back to event</button>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink sm:text-[26px]">Checkout</h1>
        {order.status === 'PENDING' && !expired && (
          <div className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${urgent ? 'animate-pulse bg-brand text-white' : 'bg-brand-soft text-brand'}`}>⏱ {mm}:{ss}</div>
        )}
      </div>

      {(expired || notPayable) && (
        <div className="mt-5 rounded-[10px] border border-brand bg-[#FFF4F5] p-5 text-center">
          <div className="text-[15px] font-semibold text-brand">{expired ? 'Your seat hold expired' : `This order is ${order.status.toLowerCase()}`}</div>
          <div className="mt-1.5 text-[13px] text-ink-mute">Held tickets are released after 15 minutes. Please start again.</div>
          <button onClick={() => navigate(ev.slug ? `/event/${ev.slug}` : '/events')} className="mt-3.5 rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white">Back to event</button>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-5">
          <section className="rounded-xl border border-line p-5">
            <h2 className="mb-4 text-base font-bold text-ink">Payment method</h2>
            {order.status === 'PENDING' && !expired ? (
              <>
                <div className="flex flex-col gap-2.5">
                  {order.currency === 'INR' && gwCard('razorpay', 'Razorpay', 'UPI · Cards · Netbanking')}
                  {gwCard('stripe', 'Stripe', 'International & domestic cards')}
                </div>
                <div className="mt-4">
                  {gateway === 'stripe' && stripe ? (
                    <StripePaymentForm clientSecret={stripe.clientSecret} publishableKey={stripe.publishableKey} orderId={orderId} />
                  ) : (
                    <button onClick={gateway === 'razorpay' ? payRazorpay : payStripe} disabled={paying} className="flex h-[46px] w-full items-center justify-center gap-2.5 rounded-md bg-brand text-[15px] font-semibold text-white transition hover:bg-brand-dark disabled:opacity-70">
                      {paying ? 'Starting…' : `Pay ${money(order.totalAmount, order.currency)}`}
                    </button>
                  )}
                </div>
                <div className="mt-3 text-center text-xs text-ink-mute">Secure checkout · webhook-confirmed · instant e-ticket</div>
              </>
            ) : (
              !expired && !notPayable && <div className="text-[13px] text-ink-mute">This order is {order.status.toLowerCase()}.</div>
            )}
          </section>
        </div>

        <aside className="rounded-xl border border-line p-5 shadow-panel lg:sticky lg:top-[120px]">
          <div className="flex items-center gap-3.5">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg"><EvImage seed={seedOf(ev.id || order.id)} url={ev.bannerUrl} label={ev.title} wmSize={16} /></div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold leading-tight text-ink">{ev.title || 'Event'}</div>
              <div className="mt-0.5 text-xs text-ink-mute">Order {order.orderNumber}</div>
            </div>
          </div>
          <div className="my-4 h-px bg-line" />
          <div className="flex flex-col gap-2.5">
            {order.items.map((l) => (
              <div key={l.ticketTypeId} className="flex justify-between text-sm text-ink-soft"><span>{l.name} × {l.quantity}</span><span className="font-medium">{l.totalPrice === 0 ? 'Free' : money(l.totalPrice, order.currency)}</span></div>
            ))}
          </div>
          <div className="my-4 h-px bg-line" />
          <div className="flex justify-between text-[13px] text-ink-soft"><span>Subtotal</span><span>{money(order.subtotal, order.currency)}</span></div>
          {order.discountAmount > 0 && <div className="mt-2 flex justify-between text-[13px] text-success"><span>Discount</span><span>− {money(order.discountAmount, order.currency)}</span></div>}
          <div className="mt-2 flex justify-between text-[13px] text-ink-soft"><span>Service fee</span><span>{money(order.serviceFee, order.currency)}</span></div>
          <div className="mt-3.5 flex items-baseline justify-between"><span className="text-base font-bold text-ink">Total</span><span className="text-base font-bold text-ink">{money(order.totalAmount, order.currency)}</span></div>
        </aside>
      </div>
    </div>
  );
}
