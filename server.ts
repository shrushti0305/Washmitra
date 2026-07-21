import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { renderBotHtml, NON_JS_BOT_UA_REGEX } from './src/lib/botContent';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Razorpay Server Client
let razorpayInstance: Razorpay | null = null;
function getRazorpay(): Razorpay | null {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      console.warn('Razorpay credentials missing. Payment features will be disabled.');
      return null;
    }
    razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return razorpayInstance;
}

// Supabase Server Client (using Service Role Key for admin tasks)
let supabaseInstance: any = null;

function getSupabase() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseUrl.startsWith('http') || !supabaseServiceKey || supabaseServiceKey.includes('your_')) {
      console.warn('Supabase credentials missing or invalid. DB features will be disabled.');
      return null;
    }
    
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseServiceKey);
    } catch (err) {
      console.error('Failed to initialize Supabase server client:', err);
      return null;
    }
  }
  return supabaseInstance;
}

app.use(express.json());

// Serve a static, real-content HTML snapshot to crawlers that don't execute
// JavaScript (most AI answer-engine bots). Regular browsers and JS-executing
// crawlers like Googlebot never match NON_JS_BOT_UA_REGEX, so they always
// get the normal React app below - this only adds a fallback, it doesn't
// change what anyone else sees.
app.get('*', (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  if (NON_JS_BOT_UA_REGEX.test(userAgent)) {
    const html = renderBotHtml(req.path);
    if (html) {
      res.type('html').send(html);
      return;
    }
  }
  next();
});

// Supabase Health Check
app.get('/api/db-check', async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.from('bookings').select('count', { count: 'exact', head: true });
    if (error) throw error;
    res.json({ status: 'connected', count: data });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message || 'Supabase not configured' });
  }
});

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Create a Razorpay order. Amount is passed in rupees; Razorpay expects paise.
app.post('/api/create-order', async (req, res) => {
  try {
    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.status(500).json({ error: 'Payment gateway is not configured on this server yet.' });
    }
    const { amount, purpose } = req.body;
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'A valid amount is required.' });
    }
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `${purpose || 'order'}_${Date.now()}`,
    });
    res.json(order);
  } catch (error: any) {
    console.error('Razorpay order creation failed:', error);
    res.status(500).json({ error: 'Could not create payment order.' });
  }
});

// Verify the payment signature Razorpay returns to the client after checkout.
// This MUST happen server-side — never trust a client-reported "success".
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ verified: false, error: 'Payment gateway is not configured on this server yet.' });
    }
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ verified: false, error: 'Missing payment verification fields.' });
    }
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const verified = expectedSignature === razorpay_signature;
    res.json({ verified, razorpay_order_id, razorpay_payment_id });
  } catch (error: any) {
    console.error('Payment verification failed:', error);
    res.status(500).json({ verified: false, error: 'Verification failed.' });
  }
});

// Impact Story Generation API
app.post('/api/generate-impact', async (req, res) => {
  try {
    const { location, projectType } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const prompt = `Generate a short, inspiring impact story for a WASH Mitra project in ${location}. 
    The project type is ${projectType}. 
    Focus on how it changed the lives of local villagers or students. 
    Keep it under 3 words for a quick "Proof of Concept" summary or 100 words for a full story.
    Return JSON with fields: 'summary' and 'story'.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            story: { type: Type.STRING }
          },
          required: ["summary", "story"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    res.json(data);
  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ error: 'Failed to generate impact story' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
