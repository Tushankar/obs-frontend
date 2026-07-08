import { verifyAccessToken } from '../utils/tokens.js';

// Like requireAuth but never rejects: if a valid Bearer token is present it sets
// req.user, otherwise it silently continues. Used on public endpoints that
// personalize when signed in (e.g. chapter detail → isMember).
export function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      const payload = verifyAccessToken(token);
      req.user = { id: payload.sub, role: payload.role };
    } catch {
      /* ignore invalid/expired token on an optional-auth route */
    }
  }
  next();
}
