import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { useApp } from '../../context/AppContext';

// Mounts a Stripe Payment Element for the order's PaymentIntent clientSecret and
// confirms it. Fulfilment still happens via the webhook — on success we go to the
// success page which polls until the tickets appear.
export default function StripePaymentForm({ clientSecret, publishableKey, orderId }) {
  const navigate = useNavigate();
  const { pushToast } = useApp();
  const elRef = useRef(null);
  const sdk = useRef({ stripe: null, elements: null });
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const stripe = await loadStripe(publishableKey);
        if (!alive || !stripe || !elRef.current) return;
        const elements = stripe.elements({ clientSecret });
        elements.create('payment').mount(elRef.current);
        sdk.current = { stripe, elements };
        setReady(true);
      } catch (e) {
        pushToast('Could not load the card form', false);
      }
    })();
    return () => { alive = false; };
  }, [clientSecret, publishableKey, pushToast]);

  async function pay() {
    const { stripe, elements } = sdk.current;
    if (!stripe || !elements) return;
    setPaying(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/checkout/${orderId}/success` },
      redirect: 'if_required',
    });
    if (error) {
      pushToast(error.message || 'Payment failed', false);
      setPaying(false);
    } else {
      navigate(`/checkout/${orderId}/success`);
    }
  }

  return (
    <div>
      <div ref={elRef} className="min-h-[40px] rounded-md border border-line p-3" />
      <button onClick={pay} disabled={!ready || paying} className="mt-4 h-11 w-full rounded-md bg-brand text-[15px] font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60">
        {paying ? 'Processing…' : ready ? 'Pay with card' : 'Loading card form…'}
      </button>
    </div>
  );
}
