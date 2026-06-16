import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Contact Us</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2">Speak with our team or submit loan interest online</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Mail, label: 'Email', value: 'support@company.com', href: 'mailto:support@company.com' },
            { icon: Phone, label: 'Phone', value: '+91 XXX XXX XXXX', href: 'tel:+911800000000' },
            { icon: MapPin, label: 'Office', value: 'Bandra Kurla Complex, Mumbai', href: null },
            { icon: Clock, label: 'Hours', value: 'Mon–Sat, 9 AM – 7 PM IST', href: null },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="fincore-card p-6 text-center hover:shadow-md transition">
              <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto" />
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-3">{label}</p>
              {href ? (
                <a href={href} className="font-semibold text-gray-900 dark:text-slate-100 mt-1 block hover:text-blue-600">
                  {value}
                </a>
              ) : (
                <p className="font-semibold text-gray-900 dark:text-slate-100 mt-1">{value}</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition shadow-lg"
          >
            Submit Loan Interest
          </Link>
        </div>
      </div>
    </section>
  );
}
