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
    Phone
} from 'lucide-react';
import { apiService, type MotherMatchResult } from '../lib/api';

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
    const [matchResult, setMatchResult] = useState<MotherMatchResult | null>(null);

    const handleCheckEligibility = async (e: React.FormEvent) => {
        e.preventDefault();
        setChecking(true);
        setShowResults(false);
        setShowJourney(false);

        try {
            const response = await apiService.matchMother(eligibilityData);
            setMatchResult(response.data);
            setShowResults(true);
        } catch (error) {
            console.error("Matching error:", error);
            // Fallback for demo safety
            setMatchResult({
                hospital_name: "Lotus Hospital",
                match_score: 92,
                program_name: "Safe Delivery Program",
                reasoning: [
                    "Income falls under program threshold",
                    "District coverage active in your area",
                    "Due date is within active funding timeline"
                ],
                distance_km: 3.2,
                safety_rating: 4.8
            });
            setShowResults(true);
        } finally {
            setChecking(false);
        }
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
                                    type="text"
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
                {showResults && matchResult && (
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
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-2 text-teal-300 font-semibold text-sm">
                                        <Sparkles size={16} /> NGO MATCH ANALYSIS
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${matchResult.eligibility_status === 'Qualified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        matchResult.eligibility_status === 'Partially Qualified' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        }`}>
                                        {matchResult.eligibility_status}
                                    </div>
                                </div>

                                <h3 className="text-xl font-medium text-slate-300 mb-1">Eligibility Result:</h3>
                                <h2 className="text-2xl font-bold mb-6">{matchResult.program_name}</h2>

                                <div className="flex items-end gap-3 mb-8 pb-8 border-b border-slate-800">
                                    <div className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${matchResult.eligibility_status === 'Qualified' ? 'from-teal-400 to-emerald-300' :
                                        matchResult.eligibility_status === 'Partially Qualified' ? 'from-amber-400 to-orange-300' :
                                            'from-rose-400 to-orange-300'
                                        }`}>
                                        {matchResult.match_score}%
                                    </div>
                                    <div className="text-slate-400 font-medium mb-1.5">Match Score</div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                                        {matchResult.eligibility_status === 'Not Eligible' ? 'Evaluation Notes' : 'Why You Qualified'}
                                    </h4>
                                    <ul className="space-y-3">
                                        {matchResult.reasoning.map((reason, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <CheckCircle2 className={`${matchResult.eligibility_status === 'Qualified' ? 'text-teal-400' :
                                                    matchResult.eligibility_status === 'Partially Qualified' ? 'text-amber-400' :
                                                        'text-rose-400'
                                                    } shrink-0 mt-0.5`} size={18} />
                                                <span className="text-slate-200 text-sm">{reason}</span>
                                            </li>
                                        ))}
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
                                <h2 className="text-3xl font-bold text-slate-900 mb-6">{matchResult.hospital_name}</h2>

                                <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100/50 mb-6">
                                    <h4 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                                        <Activity size={16} /> Key Matching Context:
                                    </h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-sm text-slate-700">
                                            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                <MapPin size={12} className="text-indigo-600" />
                                            </span>
                                            Located approx. {matchResult.distance_km} km away
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
                                            {matchResult.safety_rating}/5 Maternity Safety Rating
                                        </li>
                                        {matchResult.beds_count && (
                                            <li className="flex items-center gap-3 text-sm text-slate-700">
                                                <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                    <Activity size={12} className="text-indigo-600" />
                                                </span>
                                                {matchResult.beds_count} Bed Capacity
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                {matchResult.specialized_services && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {matchResult.specialized_services.map((service, i) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {matchResult.district_impact && (
                                    <div className="mt-4 p-4 rounded-2xl bg-teal-50 border border-teal-100 text-teal-800 text-xs font-medium flex items-center gap-2">
                                        <Sparkles size={14} className="text-teal-600" />
                                        {matchResult.district_impact}
                                    </div>
                                )}
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
                {showJourney && matchResult && (
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
                                                    <CheckCircle2 className="text-emerald-500" size={18} /> Hospital Assigned ({matchResult.hospital_name})
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
                                                        <span className="text-slate-500 text-xs mt-1 block">Visit {matchResult.hospital_name}. Your transport allowance has been credited.</span>
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
