import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Hospital,
  Baby,
  CheckCircle2,
  Calendar,
  IndianRupee,
  MapPin,
  Search,
  ChevronRight,
  ShieldCheck,
  HeartHandshake,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [eligibilityData, setEligibilityData] = useState({
    name: '',
    pincode: '',
    income: '2–3 Lakhs',
    dueDate: '',
  });
  const [eligibilityResult, setEligibilityResult] = useState<{
    status: 'eligible' | 'limited' | null;
    message: string;
  }>({ status: null, message: '' });
  const [checking, setChecking] = useState(false);

  // Search Hospitals States
  const [searchPincode, setSearchPincode] = useState('');
  const [distance, setDistance] = useState('5km');

  // Handle Eligibility Check
  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setEligibilityResult({ status: null, message: '' });

    setTimeout(() => {
      setChecking(false);
      // Mock logic: Income below 2 Lakhs = Eligible
      if (
        eligibilityData.income === 'Below 1 Lakh' ||
        eligibilityData.income === '1–2 Lakhs'
      ) {
        setEligibilityResult({
          status: 'eligible',
          message: 'Eligible for 3 NGO-Supported Programs!',
        });
      } else {
        setEligibilityResult({
          status: 'limited',
          message: 'Limited Support Available. Government schemes may apply.',
        });
      }
    }, 1200);
  };

  return (
    <div className="space-y-16 pb-12">
      {/* SECTION 1 — HERO SECTION (Split Layout) */}
      <section className="relative pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm font-medium border border-teal-100">
              <Sparkles size={14} className="text-teal-600" />
              <span>Free matching service for mothers</span>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
              Affordable & Safe Delivery Support for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
                Every Mother
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              We help pregnant mothers find NGO-supported and affordable hospitals near them — ensuring safe and stress-free delivery care.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => {
                  document.getElementById('eligibility-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all bg-gradient-to-r from-teal-600 to-teal-500 rounded-xl hover:shadow-lg hover:-translate-y-0.5"
              >
                Check Eligibility
              </button>
              <Link
                to="/onboarding-finder"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold transition-all bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              >
                Find Nearby Hospitals
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 text-sm font-medium text-slate-600 border-t border-slate-100 mt-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-teal-600" />
                <span>500+ Mothers Supported</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-teal-600" />
                <span>Verified Hospitals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-teal-600" />
                <span>NGO Funded Programs</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-100 to-emerald-50 rounded-[2rem] transform rotate-3 scale-105 opacity-50" />
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/50 bg-white aspect-[4/3]">
              <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800"
                  alt="Happy pregnant mother"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">100% Safe</p>
                <p className="text-xs text-slate-500">Verified Partner Clinics</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — QUICK ELIGIBILITY CHECK */}
      <section id="eligibility-section" className="pt-10 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Check if You Qualify in 30 Seconds</h2>
              <p className="text-slate-500">Find out if you are eligible for NGO financial support for your delivery.</p>
            </div>

            <form onSubmit={handleCheckEligibility} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-slate-900"
                    value={eligibilityData.name}
                    onChange={(e) => setEligibilityData({ ...eligibilityData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Pincode</label>
                  <input
                    type="number"
                    required
                    placeholder="E.g. 500001"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-slate-900"
                    value={eligibilityData.pincode}
                    onChange={(e) => setEligibilityData({ ...eligibilityData, pincode: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <IndianRupee size={14} className="text-slate-400" /> Family Income (Yearly)
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-slate-900 bg-white"
                    value={eligibilityData.income}
                    onChange={(e) => setEligibilityData({ ...eligibilityData, income: e.target.value })}
                  >
                    <option>Below 1 Lakh</option>
                    <option>1–2 Lakhs</option>
                    <option>2–3 Lakhs</option>
                    <option>Above 3 Lakhs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" /> Expected Due Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-slate-900 bg-white"
                    value={eligibilityData.dueDate}
                    onChange={(e) => setEligibilityData({ ...eligibilityData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={checking}
                className="w-full mt-4 py-3.5 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                {checking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Checking matching NGOs...
                  </>
                ) : (
                  'Check Eligibility'
                )}
              </button>
            </form>

            {/* Result Box */}
            <AnimatePresence>
              {eligibilityResult.status && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className={`p-5 rounded-xl border flex items-start gap-4 ${eligibilityResult.status === 'eligible'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                      }`}
                  >
                    {eligibilityResult.status === 'eligible' ? (
                      <CheckCircle2 className="shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-semibold mb-1">
                        {eligibilityResult.status === 'eligible' ? 'Great News!' : 'Status Check Complete'}
                      </h4>
                      <p className="text-sm opacity-90">{eligibilityResult.message}</p>

                      {eligibilityResult.status === 'eligible' && (
                        <Link
                          to="/onboarding-finder"
                          className="inline-flex items-center gap-1 mt-3 text-sm font-bold text-emerald-700 hover:text-emerald-800"
                        >
                          View Matching Hospitals <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3 — HOW IT WORKS */}
      <section className="pt-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
          <p className="text-slate-500 mt-2">Connecting you to safe care in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: FileText,
              title: 'Register & Submit Details',
              text: 'Fill simple information about your pregnancy and location.',
              color: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              icon: Hospital,
              title: 'Get Matched with Hospitals',
              text: 'Our system finds NGO-supported and affordable hospitals near you.',
              color: 'text-indigo-600',
              bg: 'bg-indigo-50',
            },
            {
              icon: Baby,
              title: 'Receive Safe Care',
              text: 'Visit hospital and receive safe and affordable delivery support.',
              color: 'text-teal-600',
              bg: 'bg-teal-50',
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 text-center relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-teal-400 transition-colors" />
              <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-5 ${step.bg}`}>
                <step.icon size={26} className={step.color} />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                <span className="text-slate-400 text-sm block font-medium mb-1">Step {i + 1}</span>
                {step.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — WHY CHOOSE US */}
      <section className="pt-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Why Choose Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Verified Hospitals',
              text: 'Only trusted hospitals with maternal care experience.',
              icon: ShieldCheck,
            },
            {
              title: 'Trusted NGO Partnerships',
              text: 'NGOs support delivery costs for eligible mothers.',
              icon: HeartHandshake,
            },
            {
              title: 'Secure & Private Data',
              text: 'Your personal and medical data is fully protected.',
              icon: CheckCircle2,
            },
            {
              title: 'Easy Application Process',
              text: 'Apply in minutes and get quick responses.',
              icon: Sparkles,
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-start"
            >
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                <feature.icon size={20} className="text-teal-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 5 — FIND HOSPITALS NEAR YOU */}
      <section className="pt-10">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Find Hospitals Near You</h2>
            <p className="text-slate-400 mb-8 max-w-xl">Search our network of verified clinics and hospitals offering supported maternal care.</p>

            <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-3xl mb-8">
              <div className="flex-1 flex items-center px-4 relative">
                <Search size={18} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter Pincode or Location"
                  className="w-full pl-3 pr-4 py-3 bg-transparent outline-none text-slate-900"
                  value={searchPincode}
                  onChange={(e) => setSearchPincode(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-48 border-t sm:border-t-0 sm:border-l border-slate-100 px-2 pl-4 py-1">
                <select
                  className="w-full h-full bg-transparent outline-none text-slate-700 py-2 sm:py-0 cursor-pointer"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                >
                  <option value="1km">Within 1 km</option>
                  <option value="5km">Within 5 km</option>
                  <option value="10km">Within 10 km</option>
                  <option value="20km">Within 20 km</option>
                </select>
              </div>
              <Link
                to="/onboarding-finder"
                className="bg-teal-600 hover:bg-teal-500 transition-colors text-white font-semibold py-3 px-8 rounded-xl shrink-0 flex items-center justify-center pointer-events-auto"
              >
                Find Hospitals
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-300 mb-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-600 bg-slate-800 text-teal-500 focus:ring-teal-500 focus:ring-offset-slate-900" defaultChecked />
                Funding Available
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-600 bg-slate-800 text-teal-500 focus:ring-teal-500 focus:ring-offset-slate-900" defaultChecked />
                Emergency Care
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-600 bg-slate-800 text-teal-500 focus:ring-teal-500 focus:ring-offset-slate-900" />
                Government Schemes
              </label>
            </div>

            {/* Sample Hospital Card */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-5 sm:p-6 backdrop-blur-sm max-w-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">Lotus Hospital</h4>
                  <div className="flex items-center gap-1.5 text-teal-300 text-sm">
                    <MapPin size={14} /> Visakhapatnam (3 km)
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  Verified
                </span>
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <CheckCircle2 size={16} className="text-teal-400" /> NGO Funding Available
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <CheckCircle2 size={16} className="text-teal-400" /> Emergency Support 24/7
                </div>
              </div>

              <Link
                to="/outreach?org=Lotus%20Hospital&type=Private%20Hospital"
                className="w-full bg-white text-slate-900 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-100 transition-colors flex items-center justify-center"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — SUCCESS STORIES */}
      <section className="pt-10 pb-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Mothers We Helped</h2>
          <p className="text-slate-500">Real stories from our community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 mb-5 overflow-hidden shadow-inner border-4 border-white">
              <img src="https://images.unsplash.com/photo-1544281146-5e263259e8df?auto=format&fit=crop&q=80&w=200" alt="Lakshmi from Visakhapatnam" className="w-full h-full object-cover" />
            </div>
            <p className="text-slate-600 italic leading-relaxed mb-6">
              "I couldn't afford delivery expenses. Through this platform I found an NGO-supported hospital and had a safe delivery."
            </p>
            <div className="mt-auto">
              <h4 className="font-bold text-slate-900">Lakshmi</h4>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Visakhapatnam</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 mb-5 overflow-hidden shadow-inner border-4 border-white">
              <img src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=200" alt="Ayesha from Hyderabad" className="w-full h-full object-cover" />
            </div>
            <p className="text-slate-600 italic leading-relaxed mb-6">
              "Easy process and helpful support. Specifically the quick matches for affordable clinics near me. Highly recommended."
            </p>
            <div className="mt-auto">
              <h4 className="font-bold text-slate-900">Ayesha</h4>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Hyderabad</p>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
