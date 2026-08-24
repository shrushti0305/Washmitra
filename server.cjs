"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_supabase_js = require("@supabase/supabase-js");
var import_razorpay = __toESM(require("razorpay"), 1);
var import_crypto = __toESM(require("crypto"), 1);

// src/lib/botContent.ts
var SITE_URL = "https://washmitra.com";
var botContent = {
  "/": {
    title: "WashMitra \u2014 WASH Technicians & Skilling Platform in India",
    description: "Book trained WASH (Water, Sanitation & Hygiene) technicians for plumbing, sanitation, and water infrastructure repair across India. Join as a certified WASH Mitra.",
    heading: "WashMitra \u2014 WASH Technicians & Skilling Platform in India",
    paragraphs: [
      "WashMitra is a WASH (Water, Sanitation, and Hygiene) sector platform based in Pune, Maharashtra, India. It trains and certifies technicians, called WASH Mitras, and connects them with households and institutions across India for plumbing, sanitation, solar, and water infrastructure repair and maintenance.",
      "WashMitra combines vocational skilling with service delivery: technicians complete certification programs and then take on verified service bookings, creating steady livelihoods while improving WASH infrastructure in underserved communities."
    ]
  },
  "/about": {
    title: "About WashMitra \u2014 Our Mission for WASH Sector Workers",
    description: "WashMitra connects skilled WASH sector technicians with households and institutions across India, while providing training, certification, and steady livelihoods.",
    heading: "About WashMitra",
    paragraphs: [
      "WashMitra exists to close two gaps at once: the shortage of trained WASH (Water, Sanitation, Hygiene) technicians in India, and the lack of steady, dignified livelihoods for rural and semi-urban workers, including women.",
      "By training technicians to a certified standard and connecting them directly with paying service bookings, WashMitra creates a sustainable pipeline: skilling leads to employment, employment leads to better-maintained water and sanitation infrastructure in the communities served."
    ]
  },
  "/services": {
    title: "Our Services \u2014 Plumbing, Sanitation & Water Repair | WashMitra",
    description: "Browse and book WashMitra services: plumbing repair, sanitation maintenance, water purification installs, and more \u2014 delivered by certified technicians.",
    heading: "WashMitra Services",
    paragraphs: [
      "WashMitra-certified technicians deliver plumbing repair, sanitation system maintenance, solar installation, water purification setup, electrical work, and CCTV installation for households and institutions across India."
    ],
    list: ["Plumbing repair & installation", "Sanitation system maintenance", "Solar PV installation", "Water purification & testing", "Electrical repair", "CCTV installation"]
  },
  "/impact": {
    title: "Our Impact \u2014 WashMitra Community Stories",
    description: "See how WashMitra is improving water, sanitation, and hygiene access across Indian communities through trained local technicians and institutional partnerships.",
    heading: "WashMitra Impact",
    paragraphs: [
      "WashMitra reports the following cumulative impact figures from its training and service programs across Maharashtra and other Indian states:"
    ],
    list: [
      "820+ skilled youth trained",
      "149+ women empowered through training and employment",
      "120+ schools supported",
      "29+ villages connected",
      "33 enterprises launched by program graduates",
      "15,000+ hours of service delivered"
    ]
  },
  "/training": {
    title: "WASH Technician Training & Certification | WashMitra",
    description: "Enroll in WashMitra training batches to get certified as a WASH Mitra technician and start earning through verified service bookings.",
    heading: "WashMitra Training & Certification Programs",
    paragraphs: [
      "WashMitra runs seven certification programs for aspiring WASH sector technicians:"
    ],
    list: [
      "Electrical Technician (10 days) \u2014 household and community electrical wiring, installation, and repair",
      "Plumbing Technician (10 days) \u2014 water supply systems, pipe fitting, leakage repair, sanitation fixtures",
      "Solar Technician (4 days) \u2014 solar PV installation, operation, and maintenance",
      "Mason Technician (10 days) \u2014 construction, toilet construction, plastering, rural infrastructure",
      "CCTV Installation Technician (2 days) \u2014 camera installation, wiring, configuration",
      "Water Filter & Water Testing Technician (4 days) \u2014 filtration system installation and water quality testing",
      "Comprehensive WASH Mitra Program (18 days) \u2014 integrated training across all trades plus entrepreneurship and soft skills"
    ]
  },
  "/contact": {
    title: "Contact WashMitra",
    description: "Get in touch with WashMitra for service bookings, partnership inquiries, or support \u2014 we typically respond within one business day.",
    heading: "Contact WashMitra",
    paragraphs: [
      "WashMitra is headquartered at Plot No. 12, Tech Park, Pune, Maharashtra 411001, India.",
      "Email: support@washmitra.com or washmitra.india@gmail.com",
      "Phone: +91 96579 78896 / +91 20 2567 8901"
    ]
  }
};
function renderBotHtml(path2) {
  const page = botContent[path2];
  if (!page) return null;
  const url = `${SITE_URL}${path2}`;
  const listHtml = page.list ? `<ul>${page.list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";
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
${page.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n")}
${listHtml}
</body>
</html>`;
}
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
var NON_JS_BOT_UA_REGEX = /gptbot|chatgpt-user|oai-searchbot|google-extended|perplexitybot|perplexity-user|claudebot|anthropic-ai|claude-web|ccbot|bytespider|bingbot|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|discordbot|telegrambot|applebot/i;

// server.ts
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = process.env.PORT || 3e3;
var razorpayInstance = null;
function getRazorpay() {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      console.warn("Razorpay credentials missing. Payment features will be disabled.");
      return null;
    }
    razorpayInstance = new import_razorpay.default({ key_id: keyId, key_secret: keySecret });
  }
  return razorpayInstance;
}
var supabaseInstance = null;
function getSupabase() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://mqpomswuudvovzybmuxv.supabase.co";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcG9tc3d1dWR2b3Z6eWJtdXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxODY0OTksImV4cCI6MjA5Nzc2MjQ5OX0.nhRvR8PGFqy1Ukq3OnyT2eQV-gvg6DMqrJalDvoYb_Y";
    if (!supabaseUrl || !supabaseUrl.startsWith("http") || !supabaseServiceKey) {
      console.warn("Supabase credentials missing or invalid. DB features will be disabled.");
      return null;
    }
    try {
      supabaseInstance = (0, import_supabase_js.createClient)(supabaseUrl, supabaseServiceKey);
    } catch (err) {
      console.error("Failed to initialize Supabase server client:", err);
      return null;
    }
  }
  return supabaseInstance;
}
app.use(import_express.default.json());
app.get("*", (req, res, next) => {
  const userAgent = req.headers["user-agent"] || "";
  if (NON_JS_BOT_UA_REGEX.test(userAgent)) {
    const html = renderBotHtml(req.path);
    if (html) {
      res.type("html").send(html);
      return;
    }
  }
  next();
});
app.get("/api/db-check", async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase.from("bookings").select("count", { count: "exact", head: true });
    if (error) throw error;
    res.json({ status: "connected", count: data });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message || "Supabase not configured" });
  }
});
var requestCounts = /* @__PURE__ */ new Map();
function rateLimit(maxRequests, windowMs) {
  return (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const entry = requestCounts.get(ip);
    if (!entry || now > entry.resetAt) {
      requestCounts.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (entry.count >= maxRequests) {
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }
    entry.count += 1;
    next();
  };
}
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes("your_")) {
    return null;
  }
  return new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
app.post("/api/create-order", rateLimit(20, 6e4), async (req, res) => {
  try {
    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.status(500).json({ error: "Payment gateway is not configured on this server yet." });
    }
    const { amount, purpose } = req.body;
    if (!amount || typeof amount !== "number" || amount < 1 || amount > 5e5) {
      return res.status(400).json({ error: "A valid amount between \u20B91 and \u20B95,00,000 is required." });
    }
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `${purpose || "order"}_${Date.now()}`.slice(0, 40)
    });
    res.json(order);
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    res.status(500).json({ error: "Could not create payment order." });
  }
});
app.post("/api/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ verified: false, error: "Payment gateway is not configured on this server yet." });
    }
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ verified: false, error: "Missing payment verification fields." });
    }
    const expectedSignature = import_crypto.default.createHmac("sha256", keySecret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    const verified = expectedSignature === razorpay_signature;
    res.json({ verified, razorpay_order_id, razorpay_payment_id });
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({ verified: false, error: "Verification failed." });
  }
});
app.post("/api/generate-impact", rateLimit(10, 6e4), async (req, res) => {
  try {
    const { location, projectType } = req.body;
    const ai = getAIClient();
    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }
    const prompt = `Generate a short, inspiring impact story for a WASH Mitra project in ${location || "rural Maharashtra"}. 
    The project type is ${projectType || "Water Infrastructure Maintenance"}. 
    Focus on how it changed the lives of local villagers or students. 
    Keep it under 3 words for a quick summary and under 100 words for the full story.
    Return JSON with fields: 'summary' and 'story'.`;
    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              summary: { type: import_genai.Type.STRING },
              story: { type: import_genai.Type.STRING }
            },
            required: ["summary", "story"]
          }
        }
      });
    } catch (modelErr) {
      response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              summary: { type: import_genai.Type.STRING },
              story: { type: import_genai.Type.STRING }
            },
            required: ["summary", "story"]
          }
        }
      });
    }
    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate impact story" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
