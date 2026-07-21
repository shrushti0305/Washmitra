import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the client
export const supabase = createClient(url || '', key || '');

// Helper export to resolve your 'getSupabase' error
export const getSupabase = () => supabase;

// Debugging (keep this for now)
if (!url || url.includes("undefined")) {
  console.error("Vite failed to load .env variables!");
}