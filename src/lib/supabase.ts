import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Production Supabase configuration with fallback to real project credentials
const REAL_SUPABASE_URL = 'https://mqpomswuudvovzybmuxv.supabase.co';
const REAL_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcG9tc3d1dWR2b3Z6eWJtdXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxODY0OTksImV4cCI6MjA5Nzc2MjQ5OX0.nhRvR8PGFqy1Ukq3OnyT2eQV-gvg6DMqrJalDvoYb_Y';

const url = (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL.startsWith('http'))
  ? import.meta.env.VITE_SUPABASE_URL 
  : REAL_SUPABASE_URL;

const key = (import.meta.env.VITE_SUPABASE_ANON_KEY && import.meta.env.VITE_SUPABASE_ANON_KEY.length > 20)
  ? import.meta.env.VITE_SUPABASE_ANON_KEY 
  : REAL_SUPABASE_ANON_KEY;

// Create the client
export const supabase: SupabaseClient = createClient(url, key);

// Helper export to resolve getSupabase
export const getSupabase = () => supabase;