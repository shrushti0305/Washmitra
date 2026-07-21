// Offline/fallback seed data — only used if the live Supabase fetch in App.tsx
// fails (e.g. no network). Not used as the primary data source in production.
import { ServiceCategory, Service, TrainingBatch, WashMartItem } from './types';

export const mockCategories: ServiceCategory[] = [
  { id: '1', name: 'Plumbing', description: 'Leaking taps, pipe repairs, etc.', icon: 'Droplets' },
  { id: '2', name: 'Electrical', description: 'Faulty switches, wiring, RO systems.', icon: 'Zap' },
  { id: '3', name: 'Solar', description: 'Solar panel maintenance and cleaning.', icon: 'Sun' },
  { id: '4', name: 'Masonry', description: 'Pit repairs, wall maintenance.', icon: 'Hammer' },
];

export const mockServices: Service[] = [
  { id: 't1', category_id: '1', title: 'Fix Leaking Tap', description: 'Complete repair of a leaking faucet.', base_price: 150, is_active: true },
  { id: 't2', category_id: '1', title: 'Toilet Flush Repair', description: 'Fixing the cistern or flush mechanism.', base_price: 300, is_active: true },
  { id: 't3', category_id: '2', title: 'RO Filter Change', description: 'Standard RO system filter replacement.', base_price: 500, is_active: true },
  { id: 't4', category_id: '3', title: 'Panel Cleaning', description: 'Professional cleaning of up to 4 panels.', base_price: 250, is_active: true },
];

export const mockBatches: TrainingBatch[] = [
  { id: 'b1', title: 'Pune Multi-Trade Batch 04', description: '18-day residential training for WASH O&M.', start_date: '2026-06-15', end_date: '2026-07-03', location: 'Pune Training Center', max_candidates: 30, status: 'UPCOMING' },
];

export const mockMartItems: WashMartItem[] = [
  { id: 'm1', name: 'Standard Faucet', description: 'Durable brass faucet for outdoor/washroom use.', price: 180, discount_price: 150, image_url: 'https://picsum.photos/seed/tap/200/200', stock: 50, category: 'Plumbing' },
  { id: 'm2', name: 'RO Carbon Filter', description: 'High-quality activated carbon filter.', price: 450, discount_price: 400, image_url: 'https://picsum.photos/seed/filter/200/200', stock: 20, category: 'RO Systems' },
];
