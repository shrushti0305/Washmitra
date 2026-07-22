// Server-rendered content shown ONLY to crawlers that don't execute
// JavaScript (most AI answer-engine bots: GPTBot, PerplexityBot, ClaudeBot,
// etc., plus social link-preview scrapers). Real users always get the full
// React app - this is purely so those crawlers see real text instead of an
// empty <div id="root">.
//
// Keep this factually consistent with the actual site content in
// src/components/*.tsx - it should read like an accurate summary, not
// separate marketing copy.

const SITE_URL = 'https://washmitra.com';

export interface BotPage {
  title: string;
  description: string;
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export const botContent: Record<string, BotPage> = {
  '/': {
    title: 'WashMitra — WASH Technicians & Skilling Platform in India',
    description:
      'Book trained WASH (Water, Sanitation & Hygiene) technicians for plumbing, sanitation, and water infrastructure repair across India. Join as a certified WASH Mitra.',
    heading: 'WashMitra — WASH Technicians & Skilling Platform in India',
    paragraphs: [
      'WashMitra is a WASH (Water, Sanitation, and Hygiene) sector platform based in Pune, Maharashtra, India. It trains and certifies technicians, called WASH Mitras, and connects them with households and institutions across India for plumbing, sanitation, solar, and water infrastructure repair and maintenance.',
      'WashMitra combines vocational skilling with service delivery: technicians complete certification programs and then take on verified service bookings, creating steady livelihoods while improving WASH infrastructure in underserved communities.',
    ],
  },
  '/about': {
    title: 'About WashMitra — Our Mission for WASH Sector Workers',
    description:
      'WashMitra connects skilled WASH sector technicians with households and institutions across India, while providing training, certification, and steady livelihoods.',
    heading: 'About WashMitra',
    paragraphs: [
      'WashMitra exists to close two gaps at once: the shortage of trained WASH (Water, Sanitation, Hygiene) technicians in India, and the lack of steady, dignified livelihoods for rural and semi-urban workers, including women.',
      'By training technicians to a certified standard and connecting them directly with paying service bookings, WashMitra creates a sustainable pipeline: skilling leads to employment, employment leads to better-maintained water and sanitation infrastructure in the communities served.',
    ],
  },
  '/services': {
    title: 'Our Services — Plumbing, Sanitation & Water Repair | WashMitra',
    description:
      'Browse and book WashMitra services: plumbing repair, sanitation maintenance, water purification installs, and more — delivered by certified technicians.',
    heading: 'WashMitra Services',
    paragraphs: [
      'WashMitra-certified technicians deliver plumbing repair, sanitation system maintenance, solar installation, water purification setup, electrical work, and CCTV installation for households and institutions across India.',
    ],
    list: ['Plumbing repair & installation', 'Sanitation system maintenance', 'Solar PV installation', 'Water purification & testing', 'Electrical repair', 'CCTV installation'],
  },
  '/impact': {
    title: 'Our Impact — WashMitra Community Stories',
    description:
      'See how WashMitra is improving water, sanitation, and hygiene access across Indian communities through trained local technicians and institutional partnerships.',
    heading: 'WashMitra Impact',
    paragraphs: [
      'WashMitra reports the following cumulative impact figures from its training and service programs across Maharashtra and other Indian states:',
    ],
    list: [
      '820+ skilled youth trained',
      '149+ women empowered through training and employment',
      '120+ schools supported',
      '29+ villages connected',
      '33 enterprises launched by program graduates',
      '15,000+ hours of service delivered',
    ],
  },
  '/training': {
    title: 'WASH Technician Training & Certification | WashMitra',
    description:
      'Enroll in WashMitra training batches to get certified as a WASH Mitra technician and start earning through verified service bookings.',
    heading: 'WashMitra Training & Certification Programs',
    paragraphs: [
      'WashMitra runs seven certification programs for aspiring WASH sector technicians:',
    ],
    list: [
      'Electrical Technician (10 days) — household and community electrical wiring, installation, and repair',
      'Plumbing Technician (10 days) — water supply systems, pipe fitting, leakage repair, sanitation fixtures',
      'Solar Technician (4 days) — solar PV installation, operation, and maintenance',
      'Mason Technician (10 days) — construction, toilet construction, plastering, rural infrastructure',
      'CCTV Installation Technician (2 days) — camera installation, wiring, configuration',
      'Water Filter & Water Testing Technician (4 days) — filtration system installation and water quality testing',
      'Comprehensive WASH Mitra Program (18 days) — integrated training across all trades plus entrepreneurship and soft skills',
    ],
  },
  '/contact': {
    title: 'Contact WashMitra',
    description:
      'Get in touch with WashMitra for service bookings, partnership inquiries, or support — we typically respond within one business day.',
    heading: 'Contact WashMitra',
    paragraphs: [
      'WashMitra is headquartered at Plot No. 12, Tech Park, Pune, Maharashtra 411001, India.',
      'Email: support@washmitra.com or washmitra.india@gmail.com',
      'Phone: +91 96579 78896 / +91 20 2567 8901',
    ],
  },
};

export function renderBotHtml(path: string): string | null {
  const page = botContent[path];
  if (!page) return null;

  const url = `${SITE_URL}${path}`;
  const listHtml = page.list
    ? `<ul>${page.list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="canonical" href="${url}" />
<title>${escapeHtml(page.title)}</title>
<meta name="description" content="${escapeHtml(page.description)}" />
<meta property="og:title" content="${escapeHtml(page.title)}" />
<meta property="og:description" content="${escapeHtml(page.description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="${SITE_URL}/og-image.jpg" />
<meta property="og:site_name" content="WashMitra" />
</head>
<body>
<h1>${escapeHtml(page.heading)}</h1>
${page.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n')}
${listHtml}
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Crawlers that fetch raw HTML without executing JavaScript. Real browsers
// and JS-executing crawlers (Googlebot) never match this and always get
// the normal React app.
export const NON_JS_BOT_UA_REGEX =
  /gptbot|chatgpt-user|oai-searchbot|google-extended|perplexitybot|perplexity-user|claudebot|anthropic-ai|claude-web|ccbot|bytespider|bingbot|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|discordbot|telegrambot|applebot/i;