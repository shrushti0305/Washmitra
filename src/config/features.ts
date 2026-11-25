/**
 * Feature Flags and Demo Screen Visibility Configuration.
 * 
 * Set flags to `true` when respective backend APIs, telemetry pipelines,
 * and real-time workflows are connected and ready to go live.
 */

// --- Customer Dashboard Flags ---
export const SHOW_CUSTOMER_PROGRESS_TRACKER = false;
export const SHOW_CUSTOMER_CLOSE_OUT_KEY = false;
export const SHOW_CUSTOMER_RATING_FORM = false;
export const SHOW_CUSTOMER_MOCK_METRICS = false;
export const SHOW_CUSTOMER_WORKFORCE_BANNER = false;

// --- WashMitra (Technician) Dashboard Flags ---
export const SHOW_MITRA_NEARBY_JOBS = false;
export const SHOW_MITRA_EARNINGS = false;
export const SHOW_MITRA_AUDITS = false;
export const SHOW_MITRA_TOOLKIT = false;
export const SHOW_MITRA_STATS = false;
export const SHOW_MITRA_JOB_ACTIONS = false;
export const SHOW_MITRA_SYNC_QUEUE = false;
export const SHOW_MITRA_REGISTER_BUSINESS = false;
export const SHOW_MITRA_REPORT_DAMAGE = false;

// --- Institute Dashboard Flags ---
export const SHOW_INSTITUTE_DEMO_VIEW = false;

// --- WashMart Flags ---
export const SHOW_WASHMART_BALANCE = false;
export const SHOW_WASHMART_ADD_TO_KIT = false;

// --- Layout & Navigation Flags ---
export const SHOW_NAV_PROFILE_SETTINGS = false;
export const SHOW_NAV_VIEW_ALL_ACTIVITY = false;
export const SHOW_MOBILE_BOTTOM_EXTRA_TABS = false;

// --- Localized English Strings (for easy internationalization / i18n later) ---
export const DEMO_STRINGS = {
  washMitraPlaceholder: "Your technician account is active. Job requests, earnings and your toolkit will appear here soon.",
  institutePlaceholder: "Your institution account is active. Asset tracking, service requests and billing will appear here soon.",
  washMartBanner: "Store orders are opening soon.",
} as const;
