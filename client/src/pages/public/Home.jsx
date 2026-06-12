import { useState } from 'react';

import { Link } from 'react-router-dom';

import PublicNavbar from '../../components/landing/PublicNavbar';

import PublicFooter from '../../components/landing/PublicFooter';

import AnimatedCounter from '../../components/landing/AnimatedCounter';

import LoanShowcaseCard from '../../components/landing/LoanShowcaseCard';

import AboutSection from '../../components/landing/AboutSection';

import FaqSection from '../../components/landing/FaqSection';

import ContactSection from '../../components/landing/ContactSection';

import LeadInterestModal from '../../components/landing/LeadInterestModal';

import {

  LOAN_PRODUCTS,

  WHY_CHOOSE,

  PROCESS_STEPS,

  TESTIMONIALS,

  PLATFORM_STATS,

  EMI_EXAMPLES,

} from '../../data/loanProducts';

import {

  ArrowRight,

  Zap,

  CheckCircle2,

  Star,

  Shield,

  TrendingUp,

  Users,

} from 'lucide-react';



export default function Home() {

  const [modalOpen, setModalOpen] = useState(false);

  const [modalLoanType, setModalLoanType] = useState('personal');

  const [modalEligibility, setModalEligibility] = useState(false);



  const openApply = (type) => {

    setModalLoanType(type);

    setModalEligibility(false);

    setModalOpen(true);

  };



  const openEligibility = (type) => {

    setModalLoanType(type);

    setModalEligibility(true);

    setModalOpen(true);

  };



  return (

    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 scroll-smooth">

      <PublicNavbar onApplyClick={() => openApply('personal')} />



      <LeadInterestModal

        open={modalOpen}

        onClose={() => setModalOpen(false)}

        loanType={modalLoanType}

        isEligibility={modalEligibility}

      />



      {/* Hero */}

      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200/30 via-transparent to-transparent dark:from-blue-900/20" />

        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl" />



        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div className="animate-fade-in-up">

              <p className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-950/50">

                <Shield size={14} /> Trusted by 12,500+ customers

              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-slate-100 leading-tight">

                Fast & Trusted{' '}

                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">

                  Loan Solutions

                </span>

              </h1>

              <p className="mt-6 text-lg text-gray-600 dark:text-slate-400 max-w-xl">

                Apply online in minutes. Our experts match you with competitive rates from partner banks — no direct

                loan booking until our team verifies your profile.

              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <button

                  type="button"

                  onClick={() => openApply('personal')}

                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"

                >

                  Apply Now <ArrowRight size={18} />

                </button>

                <Link

                  to="/login"

                  className="inline-flex items-center gap-2 border border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-200 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition"

                >

                  Login

                </Link>

                <Link

                  to="/register"

                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold px-4 py-3.5 hover:underline"

                >

                  Register

                </Link>

              </div>

              <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-500 dark:text-slate-400">

                <span className="flex items-center gap-1">

                  <CheckCircle2 size={16} className="text-green-500" /> No hidden fees

                </span>

                <span className="flex items-center gap-1">

                  <CheckCircle2 size={16} className="text-green-500" /> 15+ partner banks

                </span>

              </div>

            </div>



            <div className="hidden lg:block animate-fade-in-up animation-delay-200">

              <div className="fincore-card p-6 shadow-2xl border-blue-100/50 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur">

                <div className="flex items-center justify-between mb-4">

                  <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Sample EMI</span>

                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400">

                    Pre-qualified

                  </span>

                </div>

                <p className="text-4xl font-bold text-gray-900 dark:text-slate-100">

                  ₹21,580<span className="text-lg font-normal text-gray-500">/mo</span>

                </p>

                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Home loan · ₹25L · 20 years @ 8.4%</p>

                <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">

                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800">

                    <TrendingUp className="w-5 h-5 text-blue-500 mx-auto mb-1" />

                    Low rates

                  </div>

                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800">

                    <Users className="w-5 h-5 text-indigo-500 mx-auto mb-1" />

                    Expert support

                  </div>

                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800">

                    <Shield className="w-5 h-5 text-green-500 mx-auto mb-1" />

                    Secure KYC

                  </div>

                </div>

                <button

                  type="button"

                  onClick={() => openApply('home')}

                  className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"

                >

                  Check your rate

                </button>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* Loan showcase */}

      <section id="loans" className="py-20 bg-gray-50 dark:bg-slate-900/50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 text-center">Available Loans</h2>

          <p className="text-center text-gray-500 dark:text-slate-400 mt-2 mb-12 max-w-2xl mx-auto">

            Explore our products — submit interest and our CRM team will contact you. Loans are created only after

            employee verification.

          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {LOAN_PRODUCTS.map((p) => (

              <LoanShowcaseCard

                key={p.id}

                product={p}

                onApply={openApply}

                onEligibility={openEligibility}

              />

            ))}

          </div>

        </div>

      </section>



      {/* Why choose */}

      <section id="features" className="py-20">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 text-center">Why Choose FinCore</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">

            {WHY_CHOOSE.map((f) => (

              <div key={f.title} className="fincore-card p-6 flex gap-4 hover:shadow-md transition">

                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0">

                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />

                </div>

                <div>

                  <h3 className="font-semibold text-gray-900 dark:text-slate-100">{f.title}</h3>

                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{f.desc}</p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>



      <AboutSection />



      {/* Process */}

      <section id="process" className="py-20 bg-gray-50 dark:bg-slate-900/50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 text-center">Loan Process Timeline</h2>

          <p className="text-center text-gray-500 dark:text-slate-400 mt-2 mb-12">From interest form to disbursal</p>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 justify-between">

            {PROCESS_STEPS.map((s, i) => (

              <div key={s.step} className="flex-1 relative flex flex-col items-center text-center px-4">

                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center z-10 shadow-lg">

                  {s.step}

                </div>

                {i < PROCESS_STEPS.length - 1 && (

                  <div className="hidden lg:block absolute top-6 left-[60%] w-full h-0.5 bg-gradient-to-r from-blue-300 to-indigo-300 dark:from-slate-600 dark:to-slate-700" />

                )}

                <h3 className="mt-4 font-semibold text-gray-900 dark:text-slate-100">{s.title}</h3>

                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{s.desc}</p>

              </div>

            ))}

          </div>

        </div>

      </section>



      {/* EMI */}

      <section id="emi" className="py-20">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 text-center">EMI & Interest Information</h2>

          <p className="text-center text-gray-500 dark:text-slate-400 mt-2 mb-10">Illustrative examples — actual rates vary by profile</p>

          <div className="grid md:grid-cols-3 gap-6">

            {EMI_EXAMPLES.map((ex, i) => (

              <div key={i} className="fincore-card p-6 text-center hover:shadow-lg transition">

                <p className="text-sm text-gray-500 dark:text-slate-400">Loan ₹{(ex.amount / 100000).toFixed(1)}L</p>

                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">

                  ₹{ex.emi.toLocaleString('en-IN')}

                  <span className="text-sm font-normal text-gray-500 dark:text-slate-400">/mo</span>

                </p>

                <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">

                  {ex.tenure} months @ {ex.rate}% APR

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>



      {/* Stats */}

      <section className="py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 dark:from-blue-800 dark:via-indigo-800 dark:to-indigo-900">

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">

          {PLATFORM_STATS.map((s) => (

            <div key={s.label}>

              <p className="text-3xl lg:text-4xl font-bold">

                <AnimatedCounter end={s.value} suffix={s.suffix} />

              </p>

              <p className="text-blue-100 mt-2 text-sm">{s.label}</p>

            </div>

          ))}

        </div>

      </section>



      {/* Testimonials */}

      <section className="py-20 bg-gray-50 dark:bg-slate-900/50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 text-center">What Customers Say</h2>

          <div className="grid md:grid-cols-3 gap-6 mt-12">

            {TESTIMONIALS.map((t) => (

              <div key={t.name} className="fincore-card p-6 hover:shadow-md transition">

                <div className="flex gap-1 text-amber-400 mb-3">

                  {[1, 2, 3, 4, 5].map((n) => (

                    <Star key={n} size={16} fill="currentColor" />

                  ))}

                </div>

                <p className="text-gray-600 dark:text-slate-300 text-sm italic">&ldquo;{t.text}&rdquo;</p>

                <p className="mt-4 font-semibold text-gray-900 dark:text-slate-100">{t.name}</p>

                <p className="text-xs text-gray-500 dark:text-slate-400">

                  {t.city} · {t.loan}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>



      <FaqSection />

      <ContactSection />



      {/* CTA */}

      <section className="py-16">

        <div className="max-w-3xl mx-auto px-4 text-center">

          <Zap className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto" />

          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-4">Ready to get started?</h2>

          <p className="text-gray-500 dark:text-slate-400 mt-2">

            Submit your loan interest — our team will contact you within 24 hours.

          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">

            <button

              type="button"

              onClick={() => openApply('personal')}

              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"

            >

              Show Interest <ArrowRight size={18} />

            </button>

            <Link

              to="/apply"

              className="inline-flex items-center gap-2 border border-gray-300 dark:border-slate-600 px-8 py-3 rounded-xl font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"

            >

              Full Application Form

            </Link>

          </div>

        </div>

      </section>



      <PublicFooter />

    </div>

  );

}

