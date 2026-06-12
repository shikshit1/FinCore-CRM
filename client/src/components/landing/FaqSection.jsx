import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../../data/faq';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-slate-900/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 text-center">Frequently Asked Questions</h2>
        <p className="text-center text-gray-500 dark:text-slate-400 mt-2 mb-10">
          Everything you need to know about our public loan interest process
        </p>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q} className="fincore-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-semibold text-gray-900 dark:text-slate-100">{item.q}</span>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-blue-600 transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </button>
                {open && (
                  <p className="px-5 pb-5 text-sm text-gray-600 dark:text-slate-400 leading-relaxed -mt-1">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
