// Load an external script once (memoized by src). Used for Razorpay checkout.js.
const cache = {};
export function loadScript(src) {
  if (cache[src]) return cache[src];
  cache[src] = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => { cache[src] = null; reject(new Error(`Failed to load ${src}`)); };
    document.head.appendChild(s);
  });
  return cache[src];
}
