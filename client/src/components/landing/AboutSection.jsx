import { Shield, Award, Globe } from 'lucide-react';

const HIGHLIGHTS = [
  {
    icon: Shield,
    title: 'Regulated Partners',
    desc: 'We work only with RBI-regulated banks and NBFCs for transparent lending.',
  },
  {
    icon: Award,
    title: '10+ Years Experience',
    desc: 'Thousands of families and businesses funded across metros and tier-2 cities.',
  },
  {
    icon: Globe,
    title: 'Pan-India Coverage',
    desc: 'Digital onboarding with local relationship managers in major cities.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">About FinCore</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-2">
              Your finance partner from interest to disbursal
            </h2>
            <p className="mt-4 text-gray-600 dark:text-slate-400 leading-relaxed">
              FinCore is a modern loan advisory platform. Visitors submit interest online; our CRM team qualifies
              leads, collects documents, and coordinates with partner banks. Customers track progress in a dedicated
              portal after conversion.
            </p>
            <p className="mt-4 text-gray-600 dark:text-slate-400 leading-relaxed">
              We never auto-create loans from public forms — every application is reviewed by a licensed employee
              before it enters the workflow.
            </p>
          </div>
          <div className="space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="fincore-card p-5 flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
