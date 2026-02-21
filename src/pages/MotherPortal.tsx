import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Calendar,
    IndianRupee,
    MapPin,
    Sparkles,
    Baby,
    Activity,
    Award,
    ChevronRight,
    ShieldCheck,
    Building2,
    Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MotherPortal() {
    const [eligibilityData, setEligibilityData] = useState({
        name: '',
        pincode: '',
        income: '1–2 Lakhs',
        dueDate: '',
    });
    const [checking, setChecking] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showJourney, setShowJourney] = useState(false);

    const handleCheckEligibility = (e: React.FormEvent) => {
        e.preventDefault();
        setChecking(true);
        setShowResults(false);
        setShowJourney(false);

        // Mock API delay
        setTimeout(() => {
            setChecking(false);
            setShowResults(true);
        }, 1500);
    };

    const handleRegister = () => {
        setShowJourney(true);
        // Smooth scroll to journey
        setTimeout(() => {
            document.getElementById('journey-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <div className="space-y-12 pb-16 max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm font-medium border border-teal-100 mb-4">
                    <Baby size={16} /> Mother's Portal
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
                    Your Safe Delivery Journey
                </h1>
                <p className="text-slate-500 max-w-xl mx-auto">
                    We match you with the best affordable healthcare options and track your pregnancy milestones stress-free.
                </p>
            </div>

            {/* STEP 1: ELIGIBILITY CHECKER */}
            <section className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-10 relative overflow-hidden">
                {/* Decorative spark */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-100 rounded-full blur-3xl opacity-50" />

                <div className="relative z-10">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <span className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        Check Funding Eligibility
                    </h2>

                    <form onSubmit={handleCheckEligibility} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Lakshmi"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 focus:ring-1 text-slate-900"
                                    value={eligibilityData.name}
                                    onChange={(e) => setEligibilityData({ ...eligibilityData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                                    <MapPin size={14} className="text-slate-400" /> Pincode
                                </label>
                                <input
                                    type="number"
                                    required
                                    placeholder="e.g. 530016"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 focus:ring-1 text-slate-900"
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
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 focus:ring-1 text-slate-900 bg-white"
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
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 focus:ring-1 text-slate-900"
                                    value={eligibilityData.dueDate}
                                    onChange={(e) => setEligibilityData({ ...eligibilityData, dueDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={checking}
                            className="w-full py-4 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                        >
                            {checking ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Running AI Match Analysis...
                                </>
                            ) : (
                                'Find My Matches'
                            )}
                        </button>
                    </form>
                </div>
            </section>

            {/* STEP 2: RESULTS (AI Match Score & Recommendations) */}
            <AnimatePresence>
                {showResults && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        {/* Feature 4: NGO Funding Match Score */}
                        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <Award size={100} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-teal-300 font-semibold text-sm mb-6">
                                    <Sparkles size={16} /> NGO MATCH ANALYSIS
                                </div>

                                <h3 className="text-xl font-medium text-slate-300 mb-1">Eligibility Result:</h3>
                                <h2 className="text-2xl font-bold mb-6">Safe Delivery Program</h2>

                                <div className="flex items-end gap-3 mb-8 pb-8 border-b border-slate-800">
                                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
                                        92%
                                    </div>
                                    <div className="text-slate-400 font-medium mb-1.5">Match Score</div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Why You Qualified</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="text-teal-400 shrink-0 mt-0.5" size={18} />
                                            <span className="text-slate-200 text-sm">Income ({eligibilityData.income}) falls under program threshold</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="text-teal-400 shrink-0 mt-0.5" size={18} />
                                            <span className="text-slate-200 text-sm">District coverage active in your area (Pincode: {eligibilityData.pincode})</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="text-teal-400 shrink-0 mt-0.5" size={18} />
                                            <span className="text-slate-200 text-sm">Due date is within the active funding timeline</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Feature 1: AI Hospital Recommendation */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col">
                            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-6">
                                <Sparkles size={16} /> AI HOSPITAL RECOMMENDATION
                            </div>

                            <div className="flex-1">
                                <h3 className="text-slate-500 font-medium mb-1">Best Hospital for You</h3>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6">Lotus Hospital</h2>

                                <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100/50 mb-6">
                                    <h4 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                                        <Activity size={16} /> Why Recommended:
                                    </h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-sm text-slate-700">
                                            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                <MapPin size={12} className="text-indigo-600" />
                                            </span>
                                            Closest matched hospital (3.2 km away)
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-slate-700">
                                            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                <IndianRupee size={12} className="text-indigo-600" />
                                            </span>
                                            Accepts 100% of your approved NGO funding
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-slate-700">
                                            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                <ShieldCheck size={12} className="text-indigo-600" />
                                            </span>
                                            4.8/5 Maternity Safety Rating
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-auto pt-2">
                                <button
                                    onClick={handleRegister}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold transition-colors flex justify-center items-center gap-2"
                                >
                                    Accept & Register <ChevronRight size={16} />
                                </button>
                                <button className="px-5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                                    View Other Options
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* STEP 3: PREGNANCY JOURNEY TRACKER */}
            <AnimatePresence>
                {showJourney && (
                    <motion.div
                        id="journey-section"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-6 overflow-hidden"
                    >
                        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-10">
                            <div className="text-center mb-10">
                                <div className="bg-teal-50 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4">
                                    <Baby size={32} className="text-teal-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Pregnancy Journey Tracker</h2>
                                <p className="text-slate-500">Your personalized timeline for a safe delivery</p>
                            </div>

                            <div className="max-w-3xl mx-auto">
                                <div className="relative border-l-2 border-slate-100 ml-3 md:ml-6 space-y-12 pb-4">

                                    {/* Past Step */}
                                    <div className="relative pl-8 md:pl-10">
                                        <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                                        <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3">Month 4-5 (Current)</h3>
                                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-3 text-slate-700 font-medium line-through opacity-60">
                                                    <CheckCircle2 className="text-emerald-500" size={18} /> Eligibility Check & Registration
                                                </li>
                                                <li className="flex items-center gap-3 text-slate-700 font-medium line-through opacity-60">
                                                    <CheckCircle2 className="text-emerald-500" size={18} /> Hospital Assigned (Lotus Hospital)
                                                </li>
                                                <li className="flex items-center gap-3 text-slate-900 font-semibold bg-white p-3 rounded-xl border border-slate-200 shadow-sm mt-4">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                                        <Phone size={14} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="block text-sm">Action Required Today</span>
                                                        <span className="block text-xs text-slate-500 font-normal">Hospital Welcome Call Scheduled for 2:00 PM</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Upcoming Step */}
                                    <div className="relative pl-8 md:pl-10">
                                        <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-amber-400 border-4 border-white shadow-sm animate-pulse" />
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Month 6 (Upcoming)</h3>
                                        <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
                                            <ul className="space-y-4">
                                                <li className="flex items-start gap-3">
                                                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                                                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                    </div>
                                                    <div>
                                                        <span className="block text-slate-900 font-semibold text-sm">Routine Checkup 1</span>
                                                        <span className="text-slate-500 text-xs mt-1 block">Visit Lotus Hospital. Your transport allowance has been credited.</span>
                                                    </div>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                                                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                    </div>
                                                    <div>
                                                        <span className="block text-slate-900 font-semibold text-sm">Blood Test & Anemia Screening</span>
                                                        <span className="text-slate-500 text-xs mt-1 block">Covered 100% by your NGO funding plan.</span>
                                                    </div>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                                                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                    </div>
                                                    <div>
                                                        <span className="block text-slate-900 font-semibold text-sm">Nutrition Consultation Call</span>
                                                        <span className="text-slate-500 text-xs mt-1 block">A certified nutritionist will guide your trimesters diet plan.</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Future Step */}
                                    <div className="relative pl-8 md:pl-10">
                                        <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-slate-200 border-4 border-white" />
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Month 7-9</h3>
                                        <div className="opacity-50 pointer-events-none">
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-3 text-slate-500">
                                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300" /> Delivery Planning & Registration
                                                </li>
                                                <li className="flex items-center gap-3 text-slate-500">
                                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300" /> 3rd Trimester Scans
                                                </li>
                                                <li className="flex items-center gap-3 text-slate-500 font-semibold">
                                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300" /> Admission & Safe Delivery
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
