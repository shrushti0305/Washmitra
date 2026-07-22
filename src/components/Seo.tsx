import { useEffect } from 'react';

const SITE_URL = 'https://washmitra.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SeoProps {
  title: string;
  description: string;
  path: string; // e.g. '/about' — used to build the canonical URL
  noindex?: boolean;
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

// Updates <title> + meta tags for the current route. Note: this only affects
// what browsers and JS-executing crawlers (Googlebot) see. Crawlers that
// DON'T execute JS — WhatsApp, LinkedIn, Twitter/X link previews — will only
// ever see the static tags baked into index.html at build time. Getting
// per-page social preview cards requires prerendering or SSR, which is a
// separate, larger change from this client-side SEO pass.
export default function Seo({ title, description, path, noindex }: SeoProps) {
  useEffect(() => {
    const fullTitle = title;
    const url = `${SITE_URL}${path}`;

    document.title = fullTitle;
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setCanonical(url);

    // Open Graph
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:image', DEFAULT_OG_IMAGE);
    setMetaTag('property', 'og:site_name', 'WashMitra');

    // Twitter card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', DEFAULT_OG_IMAGE);
  }, [title, description, path, noindex]);

  return null;
}