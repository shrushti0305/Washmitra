import { useEffect, useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import Landing from './components/Landing';
import ScrollToTop from './components/ScrollToTop';
import Seo from './components/Seo';
import { seoContent } from './lib/seoContent';
import { Button } from '@/components/ui/button';

// Code-split everything that isn't needed for first paint. These are only
// rendered once a route is actually visited, so there's no reason to ship
// them in the initial bundle.
const Auth = lazy(() => import('./components/Auth'));
const CustomerDashboard = lazy(() => import('./components/CustomerDashboard'));
const WashMitraDashboard = lazy(() => import('./components/WashMitraDashboard'));
const InstituteDashboard = lazy(() => import('./components/InstituteDashboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const About = lazy(() => import('./components/About'));
const Impact = lazy(() => import('./components/Impact'));
const Contact = lazy(() => import('./components/Contact'));
// ServiceFlow.tsx now contains the single, unified services page (Company
// Products & Services + Request a Service + Service Catalogue all in one
// component). This replaces the old separate ServiceFlow + Catalogue
// pairing, which was causing the "Services that show up, on time, every
// time." heading to render twice on /services.
const ServiceFlow = lazy(() => import('./components/ServiceFlow'));
const WashMitraFeeGate = lazy(() => import('./components/WashMitraFeeGate'));
const TrainingCatalogue = lazy(() => import('./components/TrainingCatalogue'));

function RouteFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 rounded-full border-4 border-[#F16622] border-t-transparent animate-spin" />
    </div>
  );
}

// Shared chrome for every non-home content route: SEO tags + back button + fade-in.
function Page({
  seo,
  path,
  children,
}: {
  seo: { title: string; description: string };
  path: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <div className="animate-in fade-in duration-500">
      <Seo title={seo.title} description={seo.description} path={path} />
      <Button variant="ghost" className="mb-8" onClick={() => navigate('/')}>← Back</Button>
      {children}
    </div>
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="text-center py-24">
      <Seo title="Page Not Found — WashMitra" description="This page doesn't exist." path="/404" noindex />
      <h1 className="text-4xl font-black text-[#062D27] mb-4">Page not found</h1>
      <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
      <Button onClick={() => navigate('/')}>Back to home</Button>
    </div>
  );
}

export default function App() {
  const { user, setUser, setInitialData } = useStore();

  // Fetch a profile row from Supabase and hydrate the store's `user`.
  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!error && data) {
      setUser({
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        is_paid: data.is_paid,
        phone: data.phone,
        avatar_url: data.avatar_url,
        district: data.district,
        location: data.location_lat && data.location_lng ? {
          lat: data.location_lat,
          lng: data.location_lng,
          address: data.location_address,
        } : undefined,
        created_at: data.created_at,
      });
    }
  };

  // Wait for the initial session check before rendering anything auth-gated.
  const [authChecked, setAuthChecked] = useState(false);

  // 1. Restore session on load + keep the store in sync with auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadProfile(session.user.id);
      setAuthChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        loadProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Load real catalog data from Supabase
  useEffect(() => {
    async function loadInitialData() {
      const [{ data: categories }, { data: services }, { data: batches }, { data: martItems }] = await Promise.all([
        supabase.from('service_categories').select('*'),
        supabase.from('services').select('*').eq('is_active', true),
        supabase.from('training_batches').select('*'),
        supabase.from('washmart_items').select('*').eq('is_active', true),
      ]);
      setInitialData({
        categories: categories ?? [],
        services: services ?? [],
        batches: batches ?? [],
        martItems: martItems ?? [],
      });
    }
    loadInitialData();
  }, [setInitialData]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
        <div className="h-10 w-10 rounded-full border-4 border-[#F16622] border-t-transparent animate-spin" />
      </div>
    );
  }

  const homeContent = !user ? (
    <>
      <Seo title={seoContent.home.title} description={seoContent.home.description} path="/" />
      <Landing />
    </>
  ) : user.role === 'WASHMITRA' && user.is_paid === false ? (
    <>
      <Seo title="Complete Your Enrollment — WashMitra" description="Complete your WASH Mitra enrollment fee to activate your account." path="/" noindex />
      <WashMitraFeeGate />
    </>
  ) : (
    <>
      <Seo title="Dashboard — WashMitra" description="Your WashMitra dashboard." path="/" noindex />
      {user.role === 'CUSTOMER' && <CustomerDashboard />}
      {user.role === 'WASHMITRA' && <WashMitraDashboard />}
      {user.role === 'INSTITUTION' && <InstituteDashboard />}
      {user.role === 'ADMIN' && <AdminDashboard />}
    </>
  );

  return (
    <NotificationProvider>
      <ScrollToTop />
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-6 pt-32">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={homeContent} />
              <Route
                path="/login"
                element={
                  user ? (
                    <Navigate to="/" replace />
                  ) : (
                    <div className="py-12">
                      <Seo title={seoContent.login.title} description={seoContent.login.description} path="/login" noindex />
                      <Auth />
                    </div>
                  )
                }
              />
              <Route path="/about" element={<Page seo={seoContent.about} path="/about"><About /></Page>} />
              <Route path="/services" element={<Page seo={seoContent.services} path="/services"><ServiceFlow /></Page>} />
              <Route path="/impact" element={<Page seo={seoContent.impact} path="/impact"><Impact /></Page>} />
              <Route path="/contact" element={<Page seo={seoContent.contact} path="/contact"><Contact /></Page>} />
              <Route path="/training" element={<Page seo={seoContent.training} path="/training"><TrainingCatalogue /></Page>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </Layout>
    </NotificationProvider>
  );
}