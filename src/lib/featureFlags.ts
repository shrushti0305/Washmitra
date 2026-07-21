// Feature flags. Flip these when ready to go live with the full product —
// no need to hunt through components, everything reads from here.

// Controls whether "Book a Service", "Become a WASH Mitra", and "Partner
// Login" CTAs appear in the nav. Turn this on once payments/enrollment are
// ready to launch — the underlying code (Auth, booking flow, Razorpay) is
// untouched, this only hides the entry points.
export const SHOW_TRANSACTIONAL_FEATURES = false;
