import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  X, 
  Send, 
  MessageCircle, 
  Sparkles, 
  Phone, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoUrl from '../assets/images/WASH Mitra logo.png';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  options?: { label: string; action: string }[];
  link?: { label: string; href: string; external?: boolean };
}

const QUICK_PROMPTS = [
  "💧 Book a Service",
  "🛠️ Training & Skilling",
  "📍 Operating Districts",
  "📞 Contact Helpline",
];

export default function WashMitraChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Namaste! 🙏 I am your WASH Mitra AI Assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: [
        { label: "Book a Service", action: "Book a Service" },
        { label: "Become a WASH Mitra", action: "Become a WASH Mitra" },
        { label: "Our Impact & Reach", action: "Our Impact & Reach" },
        { label: "Contact Helpline", action: "Contact Helpline" }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const getBotResponse = (query: string): Message => {
    const q = query.toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (q.includes('book') || q.includes('service') || q.includes('repair') || q.includes('plumbing') || q.includes('ro') || q.includes('solar')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: "We offer multi-trade repair & preventive maintenance across Plumbing, RO Water Filtration, Solar PV, Electrical, and Masonry for households, schools, and Panchayats.",
        timestamp: time,
        link: { label: "View All Services", href: "/services" },
        options: [
          { label: "Chat on WhatsApp", action: "Contact Helpline" },
          { label: "Explore Training Hub", action: "Become a WASH Mitra" }
        ]
      };
    }

    if (q.includes('train') || q.includes('mitra') || q.includes('join') || q.includes('become') || q.includes('course') || q.includes('skill')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: "WASHMITRA provides 30-day hands-on certification for rural youth in plumbing, electrical, solar O&M, and sanitation system maintenance with direct job deployment!",
        timestamp: time,
        link: { label: "Explore Skilling Batches", href: "/training" },
        options: [
          { label: "View Impact Report", action: "Our Impact & Reach" },
          { label: "Contact Coordinator", action: "Contact Helpline" }
        ]
      };
    }

    if (q.includes('impact') || q.includes('reach') || q.includes('district') || q.includes('where') || q.includes('location') || q.includes('pune') || q.includes('maharashtra')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: "WASHMITRA operates across 29 districts in Maharashtra (including Pune, Palghar, Gadchiroli, Nashik) and 5 districts in Chhattisgarh, with over 850+ trained Mitras and ₹49 Lakh tribal income generated!",
        timestamp: time,
        link: { label: "View Detailed Impact Data", href: "/impact" },
        options: [
          { label: "Book a Service", action: "Book a Service" },
          { label: "Contact Helpline", action: "Contact Helpline" }
        ]
      };
    }

    if (q.includes('contact') || q.includes('phone') || q.includes('whatsapp') || q.includes('call') || q.includes('number') || q.includes('helpline')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: "You can reach our Pune headquarters directly:\n\n📞 Helpline: +91 94215 28996\n💬 WhatsApp: +91 94215 28996\n✉️ Email: info@washmitra.com",
        timestamp: time,
        link: { label: "Chat Directly on WhatsApp", href: "https://wa.me/919421528996", external: true },
        options: [
          { label: "View Contact Page", action: "Contact Page" }
        ]
      };
    }

    return {
      id: Date.now().toString(),
      sender: 'bot',
      text: "Thank you for asking! WASHMITRA is dedicated to rural water, sanitation, and technical skilling. You can chat with our team directly on WhatsApp or explore our services.",
      timestamp: time,
      link: { label: "Chat on WhatsApp", href: "https://wa.me/919421528996", external: true },
      options: [
        { label: "Book a Service", action: "Book a Service" },
        { label: "Explore Training Hub", action: "Become a WASH Mitra" }
      ]
    };
  };

  const handleSend = (textToSend?: string) => {
    const userQuery = textToSend || input.trim();
    if (!userQuery) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userQuery,
      timestamp: time
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Simulate bot thinking delay
    setTimeout(() => {
      const botMsg = getBotResponse(userQuery);
      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  const handleOptionClick = (action: string) => {
    if (action === "Contact Page") {
      navigate('/contact');
      setIsOpen(false);
    } else {
      handleSend(action);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: "Namaste! 🙏 How can I assist you with WASHMITRA services or skilling today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: [
          { label: "Book a Service", action: "Book a Service" },
          { label: "Become a WASH Mitra", action: "Become a WASH Mitra" },
          { label: "Contact Helpline", action: "Contact Helpline" }
        ]
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            <div className="hidden sm:flex items-center gap-2 bg-[#062D27] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-white/10 text-xs font-black tracking-wide group-hover:scale-105 transition-transform">
              <Sparkles className="h-3.5 w-3.5 text-[#F26522] animate-pulse" />
              <span>Ask WASH Mitra AI</span>
            </div>
            <button
              aria-label="Open WASH Mitra AI Chatbot"
              className="relative w-14 h-14 bg-[#F26522] hover:bg-[#d95d1f] text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/20"
            >
              <Bot className="h-7 w-7" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[92vw] sm:w-[380px] h-[520px] bg-white rounded-[32px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#062D27] text-white p-4 sm:p-5 flex items-center justify-between relative overflow-hidden">
              <div className="flex items-center gap-3 z-10">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center p-1.5 shrink-0">
                  <img src={logoUrl} alt="WASHMitra Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-sm uppercase tracking-wider text-white">WASH Mitra AI</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[10px] font-bold text-white/50 tracking-widest uppercase">Assistant • Online</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 z-10">
                <button
                  onClick={resetChat}
                  title="Reset conversation"
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F9F9F7]/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#F26522] text-white rounded-br-none'
                        : 'bg-white text-[#062D27] border border-slate-100 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Action Link inside Bot Message */}
                    {msg.link && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100">
                        {msg.link.external ? (
                          <a
                            href={msg.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-600 hover:underline"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>{msg.link.label}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <button
                            onClick={() => {
                              navigate(msg.link!.href);
                              setIsOpen(false);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-black text-[#F26522] hover:underline"
                          >
                            <span>{msg.link.label}</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quick Option Buttons */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-1.5 pt-1 max-w-[90%]">
                      {msg.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(opt.action)}
                          className="text-[10px] font-black uppercase tracking-wider bg-white hover:bg-[#062D27] hover:text-white text-[#062D27] px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] font-bold text-slate-400 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="text-[10px] font-bold text-slate-600 bg-slate-50 hover:bg-orange-50 hover:text-[#F26522] px-2.5 py-1 rounded-lg shrink-0 transition-colors border border-slate-100"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask WASH Mitra AI..."
                className="flex-1 h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#062D27] outline-none focus:ring-2 focus:ring-[#F26522]/30"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 bg-[#F26522] hover:bg-[#d95d1f] disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
