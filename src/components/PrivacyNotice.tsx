import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { privacyNotice, PrivacySection, PrivacySubsection, PrivacyTable } from '../content/privacyNotice';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';

function RenderTable({ table }: { table: PrivacyTable }) {
  return (
    <div className="overflow-x-auto my-6 border border-slate-200 rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {table.headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3.5 font-black text-[#062D27] uppercase text-[11px] tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {table.rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-4 py-3.5 text-slate-600 leading-relaxed align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RenderSubsection({ sub }: { sub: PrivacySubsection }) {
  return (
    <div className="mt-4 space-y-3">
      {sub.title && (
        <h3 className="text-base sm:text-lg font-bold text-[#062D27] mt-4 mb-2">
          {sub.title}
        </h3>
      )}
      {sub.paragraphs?.map((p, idx) => (
        <p key={idx} className="text-slate-600 leading-relaxed text-sm sm:text-base">
          {p}
        </p>
      ))}
      {sub.bullets && sub.bullets.length > 0 && (
        <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm sm:text-base">
          {sub.bullets.map((b, idx) => (
            <li key={idx} className="leading-relaxed">
              {b}
            </li>
          ))}
        </ul>
      )}
      {sub.table && <RenderTable table={sub.table} />}
    </div>
  );
}

function RenderSection({ section }: { section: PrivacySection }) {
  return (
    <section
      id={section.id}
      className="scroll-mt-28 py-6 border-b border-slate-100 last:border-b-0 space-y-4"
    >
      <h2 className="text-xl sm:text-2xl font-black text-[#062D27] tracking-tight">
        {section.number}. {section.title}
      </h2>

      {section.paragraphs?.map((p, idx) => (
        <p key={idx} className="text-slate-600 leading-relaxed text-sm sm:text-base">
          {p}
        </p>
      ))}

      {section.bullets && section.bullets.length > 0 && (
        <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm sm:text-base">
          {section.bullets.map((b, idx) => (
            <li key={idx} className="leading-relaxed">
              {b}
            </li>
          ))}
        </ul>
      )}

      {section.table && <RenderTable table={section.table} />}

      {section.subsections?.map((sub, idx) => (
        <RenderSubsection key={idx} sub={sub} />
      ))}
    </section>
  );
}

export default function PrivacyNotice() {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const sectionParam = searchParams.get('section');

  // Multi-language fallback: use English if translation is not yet available
  const langKey = language.toLowerCase() as 'en' | 'mr' | 'hi';
  const localizedContent = privacyNotice[langKey] || privacyNotice.en;
  const showFallbackBanner = language !== 'EN' && !privacyNotice[langKey];

  useEffect(() => {
    if (sectionParam) {
      const targetId = sectionParam.toLowerCase();
      const el = document.getElementById(targetId);
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [sectionParam]);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Fallback Banner for Marathi / Hindi */}
      {showFallbackBanner && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold flex items-center justify-between">
          <span>This notice is in English for now. Marathi and Hindi versions are coming.</span>
        </div>
      )}

      {/* Main Notice Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-slate-100">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 mb-6 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#F26522] block mb-1">
              Legal & Compliance
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#062D27] tracking-tight">
              {localizedContent.title}
            </h1>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => window.print()}
            className="print:hidden inline-flex items-center gap-2 h-11 px-5 rounded-xl border-slate-200 text-[#062D27] font-bold text-xs uppercase tracking-wider hover:bg-slate-50 shadow-sm"
          >
            <Printer className="h-4 w-4 text-[#F26522]" />
            Print Notice
          </Button>
        </header>

        <div className="space-y-6">
          {localizedContent.sections.map((section) => (
            <RenderSection key={section.id} section={section} />
          ))}
        </div>
      </div>
    </article>
  );
}
