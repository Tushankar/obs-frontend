import crypto from 'crypto';
import { Order } from '../../models/index.js';
import { forbidden, notFoundError, conflict } from '../../utils/errors.js';

// Constant-time string compare for signatures.
export function safeEqual(a, b) {
  const x = Buffer.from(String(a ?? ''), 'utf8');
  const y = Buffer.from(String(b ?? ''), 'utf8');
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

// Guard an order the caller intends to pay for: owner, still PENDING (held), not
// expired, not free.
export async function loadPayableOrder(userId, orderId) {
  const order = await Order.findById(orderId);
  if (!order) throw notFoundError('ORDER_NOT_FOUND', 'Order not found');
  if (String(order.userId) !== String(userId)) throw forbidden('NOT_ORDER_OWNER', 'This order is not yours');
  if (order.status !== 'PENDING') throw conflict('ORDER_NOT_PAYABLE', `A ${order.status} order can't be paid`);
  if (order.expiresAt && order.expiresAt <= new Date()) throw conflict('ORDER_EXPIRED', 'This order hold has expired — please start again');
  if (order.totalAmount <= 0) throw conflict('ORDER_IS_FREE', 'This order is free and already confirmed');
  return order;
}
