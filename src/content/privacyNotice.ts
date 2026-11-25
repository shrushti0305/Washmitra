/**
 * Privacy and Cookie Notice content.
 * 
 * Structured data representation for multi-lingual rendering.
 * All bracketed blanks (e.g. [COMPANY LEGAL NAME]) are preserved verbatim.
 */

export const PRIVACY_VERSION = "2026-11-draft";

export interface PrivacyTable {
  headers: string[];
  rows: string[][];
}

export interface PrivacySubsection {
  title?: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: PrivacyTable;
}

export interface PrivacySection {
  id: string;
  number: number;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: PrivacyTable;
  subsections?: PrivacySubsection[];
}

export interface PrivacyNoticeContent {
  title: string;
  sections: PrivacySection[];
}

export interface LocalizedPrivacyNotice {
  en: PrivacyNoticeContent;
  mr?: PrivacyNoticeContent;
  hi?: PrivacyNoticeContent;
}

export const privacyNotice: LocalizedPrivacyNotice = {
  en: {
    title: "Privacy and Cookie Notice",
    sections: [
      {
        id: "who-we-are",
        number: 1,
        title: "Who we are",
        paragraphs: [
          "This notice tells you what personal data we collect on this website, why we collect it, and what choices you have.",
          '"We" means [COMPANY LEGAL NAME], also called WASH Mitra. Our registered address is [REGISTERED ADDRESS].',
          "This notice covers the website washmitra.com. We follow India's Digital Personal Data Protection Act, 2023.",
          "Please read this notice before you send us your details. If you do not agree with it, please do not fill in our forms."
        ]
      },
      {
        id: "what-we-collect",
        number: 2,
        title: "What we collect and why",
        paragraphs: [
          "We collect only what we need to answer you, serve you and run the WASH Mitra network. We do not sell your data, and we do not use it for advertising."
        ],
        table: {
          headers: ["When", "What we collect", "Why we need it"],
          rows: [
            [
              "You send an enquiry",
              "Name, mobile number, email (if you give it), your message",
              "To reply to you or call you back"
            ],
            [
              "You create an account",
              "Name, mobile number, email (if you give it), the type of account (household, WASH Mitra technician or institution). We send a one-time code (OTP) to your phone.",
              "To create your account and sign you in safely"
            ],
            [
              "You book a service",
              "Name, mobile number, village, city or address, the service you chose, any notes you add",
              "To send a technician to you and contact you about the visit"
            ],
            [
              "You pay a fee",
              "Name, mobile number, email, amount, payment and order numbers",
              "To record your payment and give you a receipt"
            ],
            [
              "You are a WASH Mitra technician",
              "Name, mobile number, email, district, training and skills, jobs done, ratings, earnings",
              "To manage the technician list, give you work and pay you"
            ],
            [
              "You upload work photos",
              "The photo, its title, place and date",
              "To show completed work on the website"
            ],
            [
              "You use the chat helper",
              "The messages you type",
              "To answer your question"
            ],
            [
              "You visit the website",
              "Your internet (IP) address and browser type, recorded automatically",
              "To show you the pages and keep the site secure"
            ]
          ]
        },
        subsections: [
          {
            paragraphs: [
              "We do not see or store your card number, UPI PIN or bank password. Our payment partner handles those.",
              "Please do not upload a photo that shows another person's face unless that person has agreed.",
              "We use your data because you gave it to us for these purposes and agreed to this notice when you sent the form."
            ]
          }
        ]
      },
      {
        id: "who-receives-data",
        number: 3,
        title: "Who receives your data",
        paragraphs: [
          "We share your data only with the people and companies that help us serve you. Each one receives only what it needs for its job."
        ],
        table: {
          headers: ["Who", "What they do for us", "What they receive"],
          rows: [
            [
              "The technician assigned to your booking",
              "Carries out the service",
              "Your name, mobile number and address"
            ],
            [
              "Supabase",
              "Stores our database and runs sign-in",
              "Your account, enquiry and booking details"
            ],
            [
              "[SMS PROVIDER]",
              "Sends the one-time code to your phone",
              "Your mobile number"
            ],
            [
              "Razorpay",
              "Handles payments",
              "Your name, mobile number, email and the amount"
            ],
            [
              "GitHub Pages",
              "Hosts the website",
              "Your IP address and browser type"
            ],
            [
              "Google (fonts and maps)",
              "Shows the site's letters and maps",
              "Your IP address"
            ],
            [
              "OpenStreetMap",
              "Shows maps",
              "Your IP address"
            ],
            [
              "YouTube",
              "Plays our videos, only if you press play",
              "Your IP address and viewing details"
            ],
            [
              "WhatsApp",
              "Lets you chat with us, only if you tap the WhatsApp button",
              "Your WhatsApp number and messages"
            ],
            [
              "[Google Gemini: keep this row only if the chat helper uses it]",
              "Answers questions in the chat helper",
              "The messages you type"
            ]
          ]
        },
        subsections: [
          {
            paragraphs: [
              "We may also share data with a government body or court when the law requires it.",
              "Some of these companies may keep data on computers outside India. [DEVELOPER TO CONFIRM where the Supabase database is hosted.]"
            ]
          }
        ]
      },
      {
        id: "retention",
        number: 4,
        title: "How long we keep your data",
        paragraphs: [
          "We keep your data only as long as we need it for the purpose you gave it, or as long as the law tells us to. After that we delete it."
        ],
        table: {
          headers: ["Data", "How long we keep it"],
          rows: [
            ["Enquiries", "[NUMBER] months after we reply"],
            ["Bookings", "[NUMBER] years after the service is done"],
            ["Your account", "Until you ask us to delete it, or after [NUMBER] years without use"],
            ["Payment records", "[NUMBER] years, as tax and accounting law requires"],
            ["Security logs", "[NUMBER] months [LAWYER TO CONFIRM the minimum the law requires]"]
          ]
        },
        subsections: [
          {
            paragraphs: [
              "If you withdraw your consent or ask us to delete your data, we will delete it unless a law requires us to keep it."
            ]
          }
        ]
      },
      {
        id: "rights",
        number: 5,
        title: "Your rights",
        paragraphs: [
          "Your data belongs to you. You can ask us, free of charge, to do any of these:"
        ],
        bullets: [
          "See your data. Ask what data we hold about you and who we shared it with.",
          "Correct your data. Ask us to fix anything that is wrong or out of date.",
          "Delete your data. Ask us to remove your data.",
          "Withdraw your consent. Tell us to stop using your data. This is as easy as giving consent.",
          "Name another person. Choose someone who can use these rights for you if you die or become unable to act.",
          "Complain. Tell us if you are unhappy with how we handled your data."
        ],
        subsections: [
          {
            title: "How to ask",
            paragraphs: [
              "Email [CONTACT EMAIL] or call [CONTACT PHONE]. Tell us your name, your mobile number and what you want us to do.",
              "We may send a one-time code to your phone to check that the request comes from you. We will reply within [REPLY TIME] days."
            ]
          },
          {
            title: "If you withdraw consent",
            paragraphs: [
              "We will stop using your data from that day. What we did before that day stays lawful. We may not be able to give you a service that needs your data, such as a booking."
            ]
          }
        ]
      },
      {
        id: "children",
        number: 6,
        title: "Children",
        paragraphs: [
          "[OWNER: keep one option and delete the other.]",
          "Option A: adults only. Our website and services are for people aged 18 or over. If you are under 18, please do not create an account or send us your details. If we learn that we hold data about a person under 18, we will delete it.",
          "Option B: under-18s with a parent's consent. If you are under 18, your parent or legal guardian must give consent before you create an account or join a training course. We will check that consent before we use your data. We do not track children's behaviour, and we do not show them targeted advertising."
        ]
      },
      {
        id: "security",
        number: 7,
        title: "How we protect your data",
        paragraphs: [
          "We take reasonable steps to keep your data safe:"
        ],
        bullets: [
          "The website uses a secure, encrypted connection (HTTPS).",
          "Access rules in our database let only you and our authorised staff see your details.",
          "Only staff who need your data for their work can open it.",
          "Payments are handled by Razorpay, so your card and bank details never reach us."
        ],
        subsections: [
          {
            paragraphs: [
              "No website can promise perfect security. If a data breach affects you, we will tell you and the Data Protection Board of India, as the law requires."
            ]
          }
        ]
      },
      {
        id: "cookies",
        number: 8,
        title: "Cookie notice",
        paragraphs: [
          "We do not use advertising cookies, tracking cookies or visitor analytics on this website.",
          "We save two small items in your browser so the site works for you:"
        ],
        table: {
          headers: ["What is saved", "Why", "How long"],
          rows: [
            ["Your sign-in session", "To keep you signed in", "Until you sign out"],
            ["Your language choice", "To remember English, Marathi or Hindi", "Until you clear your browser data"]
          ]
        },
        subsections: [
          {
            paragraphs: [
              "Some outside services may set their own cookies when you use them on our site. These are the Razorpay payment window, YouTube videos and maps. Their own privacy notices apply to those cookies.",
              "You can delete saved items at any time in your browser settings. If you do, you will be signed out and the site will return to English."
            ]
          }
        ]
      },
      {
        id: "contact",
        number: 9,
        title: "Contact, complaints and changes",
        paragraphs: [
          "For any question, request or complaint about your data, contact:"
        ],
        bullets: [
          "Name: [CONTACT PERSON]",
          "Email: [CONTACT EMAIL]",
          "Phone: [CONTACT PHONE]",
          "Address: [REGISTERED ADDRESS]"
        ],
        subsections: [
          {
            paragraphs: [
              "We will reply within [REPLY TIME] days.",
              "If you are not satisfied with our reply, you can complain to the Data Protection Board of India. [LAWYER TO ADD how to file a complaint with the Board.]"
            ]
          },
          {
            title: "Changes to this notice",
            paragraphs: [
              "We may update this notice when our services or the law change. The date below shows the latest version. If a change is important, we will put a clear message on the website.",
              "This notice is available in English, Marathi and Hindi.",
              "This notice applies from: [EFFECTIVE DATE]"
            ]
          }
        ]
      }
    ]
  }
};
