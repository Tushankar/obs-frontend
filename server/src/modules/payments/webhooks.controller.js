import * as razorpay from './razorpay.service.js';

// req.body is a raw Buffer here (express.raw mounted before express.json).
// Signature is verified against those exact bytes (§8.2). A bad signature throws
// (→ 400); handled/ignored events return 200 so the gateway stops retrying.
export async function razorpay_(req, res) {
  const result = await razorpay.handleRazorpayWebhook(req.body, req.headers['x-razorpay-signature']);
  res.status(200).json(result);
}
