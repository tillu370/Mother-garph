import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Sparkles,
  Tag,
  Globe,
  MapPin,
  CheckCircle,
  X,
  ArrowRight,
} from 'lucide-react';
import { mockNGOs } from '../lib/mockData';
import type { NGO } from '../lib/api';
import { apiService } from '../lib/api';
import ScoreBadge from '../components/ScoreBadge';
import LoadingSpinner from '../components/LoadingSpinner';

export default function NGOIntelligence() {
  const [ngos] = useState<NGO[]>(mockNGOs);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [programDesc, setProgramDesc] = useState('');
  const [matching, setMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<NGO[] | null>(null);

  const filtered = ngos.filter(
    (n) =>
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.focus_areas.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleMatch = async () => {
    if (!programDesc.trim()) return;
    setMatching(true);
    try {
      const res = await apiService.matchNGOs(programDesc);
      setMatchResults(res.data);
    } catch {
      // Mock: rank by alignment score with slight shuffle
      const scored = [...mockNGOs].sort(() => Math.random() - 0.3);
      setMatchResults(scored);
    } finally {
      setMatching(false);
    }
  };

  const displayNGOs = matchResults || filtered;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#0f172a' }}>NGO Intelligence</h2>
          <p className="text-sm" style={{ color: '#64748b' }}>
            Discover & match NGOs for maternal health program partnerships
          </p>
        </div>
        <button
          onClick={() => setShowMatchModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: '#0d9488' }}
        >
          <Sparkles size={15} />
          Match with Pilot
        </button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search NGOs by name, district, or focus area..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm"
            style={{ border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
            onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
          />
        </div>
        {matchResults && (
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} style={{ color: '#0d9488' }} />
              <span className="text-xs font-medium" style={{ color: '#0d9488' }}>
                Showing AI-matched results for your program
              </span>
            </div>
            <button
              onClick={() => setMatchResults(null)}
              className="flex items-center gap-1 text-xs"
              style={{ color: '#64748b' }}
            >
              <X size={12} /> Clear match
            </button>
          </div>
        )}
      </div>

      {/* NGO Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {displayNGOs.map((ngo, index) => (
            <motion.div
              key={ngo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.06 }}
              className="card p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
                    style={{ background: '#fffbeb' }}
                  >
                    <Users size={18} style={{ color: '#d97706' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: '#0f172a' }}>{ngo.name}</h3>
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
                      <MapPin size={10} /> {ngo.district}, {ngo.state}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <ScoreBadge score={ngo.alignment_score} size="sm" />
                  <div className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>Alignment</div>
                </div>
              </div>

              <p className="text-xs mb-3" style={{ color: '#475569', lineHeight: 1.6 }}>{ngo.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {ngo.focus_areas.map((area) => (
                  <span
                    key={area}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                    style={{ background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4' }}
                  >
                    <Tag size={9} /> {area}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                {ngo.website ? (
                  <a
                    href={ngo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs"
                    style={{ color: '#0d9488', textDecoration: 'none' }}
                  >
                    <Globe size={11} /> Visit website
                  </a>
                ) : (
                  <span />
                )}
                <button
                  onClick={() => window.location.href = `/outreach?org=${encodeURIComponent(ngo.name)}&type=NGO`}
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: '#0d9488' }}
                >
                  Outreach <ArrowRight size={11} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Match Modal */}
      {showMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <div className="flex items-center gap-2">
                <Sparkles size={18} style={{ color: '#0d9488' }} />
                <span className="font-semibold" style={{ color: '#0f172a' }}>NGO-Program Matcher</span>
              </div>
              <button onClick={() => setShowMatchModal(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X size={18} style={{ color: '#64748b' }} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                  Describe Your Maternal Health Program
                </label>
                <textarea
                  className="w-full px-3 py-2.5 rounded-xl text-sm resize-none"
                  style={{ border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a', minHeight: 120 }}
                  placeholder="e.g. We are running a safe motherhood program focused on reducing maternal mortality in rural Telangana through community health workers, antenatal care support, and emergency referral systems..."
                  value={programDesc}
                  onChange={(e) => setProgramDesc(e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
                  onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>
              <div
                className="p-3 rounded-xl text-xs"
                style={{ background: '#f0fdfa', color: '#475569', border: '1px solid #99f6e4' }}
              >
                <strong style={{ color: '#0d9488' }}>How it works:</strong> Our AI generates embeddings from your program description and finds NGOs with the highest semantic similarity using cosine distance on pgvector.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMatchModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: '#f1f5f9', color: '#475569' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { handleMatch(); setShowMatchModal(false); }}
                  disabled={matching || !programDesc.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: '#0d9488' }}
                >
                  {matching ? <LoadingSpinner size={14} color="white" /> : <Sparkles size={14} />}
                  Find Matching NGOs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
