import * as razorpay from './razorpay.service.js';

export async function razorpayOrder(req, res) {
  const result = await razorpay.createRazorpayOrder(req.user.id, req.body.orderId);
  res.status(201).json(result);
}

export async function razorpayVerify(req, res) {
  const result = await razorpay.verifyRazorpaySignature(req.user.id, req.body);
  res.status(200).json(result);
}
