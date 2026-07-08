import { OrganizerProfile } from '../models/index.js';
import { unauthorized, forbidden } from '../utils/errors.js';

// Gate for the organizer portal. Must run after requireAuth. An APPROVED
// OrganizerProfile is the authoritative capability check (approval is what
// grants the ORGANIZER role, per task 1.1) — gating on the profile status
// avoids locking out a just-approved organizer whose access token still carries
// the pre-approval role. Attaches req.organizer = the profile.
export async function requireApprovedOrganizer(req, res, next) {
  try {
    if (!req.user) return next(unauthorized());
    const profile = await OrganizerProfile.findOne({ userId: req.user.id });
    if (!profile) return next(forbidden('NOT_ORGANIZER', 'Apply to become an organizer first'));
    if (profile.status !== 'APPROVED') {
      return next(forbidden('ORGANIZER_NOT_APPROVED', `Your organizer application is ${profile.status}`));
    }
    req.organizer = profile;
    next();
  } catch (e) {
    next(e);
  }
}
