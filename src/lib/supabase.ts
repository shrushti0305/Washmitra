import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe fallbacks to prevent top-level runtime crashes when env variables are not passed at build time
const url = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-washmitra.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

// Create the client
export const supabase: SupabaseClient = createClient(url, key);

// Helper export to resolve getSupabase
export const getSupabase = () => supabase;