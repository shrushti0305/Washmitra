export const en = {
  // Navigation
  home: 'Home',
  about: 'About',
  services: 'Services',
  training: 'Training',
  impact: 'Impact',
  contact: 'Contact',

  // Hero
  tagline: 'Supporting Rural Resilience',
  heroTitleLine1: 'Real people,',
  heroTitleLine2: 'real skills,',
  heroTitleLine3: 'real impact.',
  heroDesc: "We train and deploy local technicians to maintain critical water and sanitation infrastructure across India's villages.",
  contactUs: 'Contact Us',
  exploreTraining: 'Explore Training',
  becomeMitra: 'Become a WASH Mitra',
  downloadBrief: 'Download Impact Brief (PDF)',
  getInTouch: 'Get in Touch',
  callHelpline: 'Call Helpline',
  chatWhatsapp: 'Chat on WhatsApp',
  whoWeAre: 'Who We Are',
  ourImpact: 'Our Impact',
  leadership: 'Leadership',

  // Layout & Top Nav
  'layout.nav.trainingNavigated': 'Navigated to Training Hub! Choose a certification course to enroll.',
  'layout.notifications.title': 'Notifications',
  'layout.notifications.new': 'New',
  'layout.notifications.empty': 'No new messages yet',
  'layout.notifications.viewAll': 'View all activity',
  'layout.userMenu.profile': 'Profile',
  'layout.userMenu.settings': 'Settings',
  'layout.userMenu.logout': 'Log out',
  'layout.userMenu.loggedOutSuccess': 'Logged out successfully',
  'layout.auth.partnerLogin': 'Partner Login',
  'layout.actions.bookService': 'Book a Service',
  'layout.user.welcomeBack': 'Welcome back',
  'layout.user.dashboard': 'Dashboard',
  'layout.mobileNav.requests': 'Requests',
  'layout.mobileNav.help': 'Help',

  // Footer
  'footer.tagline': 'Empowering rural communities through technical excellence and sustainable maintenance networks. Join our mission to build a better future.',
  'footer.company': 'Company',
  'footer.legal': 'Legal',
  'footer.privacyPolicy': 'Privacy Policy',
  'footer.termsOfService': 'Terms of Service',
  'footer.cookiePolicy': 'Cookie Policy',
  'footer.allRightsReserved': 'All rights reserved.',
  'footer.regionalOffices': 'Regional Offices',
  'footer.careers': 'Careers',
} as const;

export type TranslationSchema = typeof en;
export type TranslationKey = keyof TranslationSchema;
