import { Link } from 'react-router-dom';

import { Landmark, Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';



export default function PublicFooter() {

  return (

    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          <div>

            <div className="flex items-center gap-2 mb-4">

              <Landmark className="w-8 h-8 text-blue-400" />

              <span className="text-xl font-bold text-white">FinCore</span>

            </div>

            <p className="text-sm text-slate-400 leading-relaxed">

              Trusted finance partner for personal, home, business, education, and auto loans across India.

            </p>

          </div>

          <div>

            <h4 className="text-white font-semibold mb-4">Quick Links</h4>

            <ul className="space-y-2 text-sm">

              <li><Link to="/" className="hover:text-blue-400">Home</Link></li>

              <li><Link to="/apply" className="hover:text-blue-400">Apply Loan</Link></li>

              <li><a href="/#faq" className="hover:text-blue-400">FAQ</a></li>

              <li><Link to="/login" className="hover:text-blue-400">Login</Link></li>

              <li><Link to="/register" className="hover:text-blue-400">Register</Link></li>

            </ul>

          </div>

          <div>

            <h4 className="text-white font-semibold mb-4">Loan Products</h4>

            <ul className="space-y-2 text-sm">

              <li><Link to="/apply?type=personal" className="hover:text-blue-400">Personal Loan</Link></li>

              <li><Link to="/apply?type=home" className="hover:text-blue-400">Home Loan</Link></li>

              <li><Link to="/apply?type=business" className="hover:text-blue-400">Business Loan</Link></li>

              <li><Link to="/apply?type=education" className="hover:text-blue-400">Education Loan</Link></li>

              <li><Link to="/apply?type=auto" className="hover:text-blue-400">Auto Loan</Link></li>

            </ul>

          </div>

          <div>

            <h4 className="text-white font-semibold mb-4">Contact</h4>

            <ul className="space-y-3 text-sm">

              <li className="flex items-center gap-2"><Mail size={16} className="text-blue-400" /> support@fincore.com</li>

              <li className="flex items-center gap-2"><Phone size={16} className="text-blue-400" /> +91 1800-XXX-XXXX</li>

              <li className="flex items-center gap-2"><MapPin size={16} className="text-blue-400" /> Mumbai, India</li>

            </ul>

            <div className="flex gap-3 mt-4">

              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700" aria-label="LinkedIn"><Linkedin size={18} /></a>

              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700" aria-label="Twitter"><Twitter size={18} /></a>

              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700" aria-label="Facebook"><Facebook size={18} /></a>

            </div>

          </div>

        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">

          © {new Date().getFullYear()} FinCore Finance. All rights reserved. · Employees & customers: use Login above

        </div>

      </div>

    </footer>

  );

}

