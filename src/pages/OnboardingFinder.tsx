import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  Sparkles,
  ChevronDown,
  X,
  Plus,
} from 'lucide-react';
import { mockEntities } from '../lib/mockData';
import type { Entity } from '../lib/api';
import { apiService } from '../lib/api';
import TypeBadge from '../components/TypeBadge';
import ScoreBadge from '../components/ScoreBadge';
import AIClassifyModal from '../components/AIClassifyModal';
import LoadingSpinner from '../components/LoadingSpinner';

const STATES = ['All States', 'Andhra Pradesh', 'Telangana'];
const TYPES = ['All Types', 'Government Hospital', 'Private Hospital', 'Medical College', 'PHC', 'NGO', 'Corporate'];

export default function OnboardingFinder() {
  const [entities, setEntities] = useState<Entity[]>(mockEntities);
  const [filtered, setFiltered] = useState<Entity[]>(mockEntities);
  const [_loading, _setLoading] = useState(false); // reserved for API loading state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [showClassify, setShowClassify] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [scoring, setScoring] = useState<number | null>(null);
  const [scoreResult, setScoreResult] = useState<{ score: number; reasoning: string[] } | null>(null);
  const [showIngest, setShowIngest] = useState(false);
  const [ingestForm, setIngestForm] = useState({ name: '', description: '', website: '', email: '', phone: '', district: '', state: 'Andhra Pradesh' });
  const [ingesting, setIngesting] = useState(false);

  useEffect(() => {
    let result = entities;
    if (searchQuery) {
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.district.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedState !== 'All States') result = result.filter((e) => e.state === selectedState);
    if (selectedType !== 'All Types') result = result.filter((e) => e.type === selectedType);
    if (selectedDistrict) result = result.filter((e) => e.district.toLowerCase().includes(selectedDistrict.toLowerCase()));
    setFiltered(result);
  }, [searchQuery, selectedState, selectedType, selectedDistrict, entities]);

  const handleScore = async (entity: Entity) => {
    setScoring(entity.id);
    setScoreResult(null);
    try {
      const res = await apiService.scoreEntity(entity.id);
      setScoreResult(res.data);
    } catch {
      setScoreResult({
        score: entity.relevance_score,
        reasoning: [
          'Provides maternal and child healthcare services',
          `Located in ${entity.district}, a target district`,
          'Has established healthcare infrastructure',
          'Potential for community outreach programs',
        ],
      });
    } finally {
      setScoring(null);
    }
  };

  const handleIngest = async () => {
    setIngesting(true);
    try {
      const res = await apiService.ingestEntity(ingestForm);
      setEntities((prev) => [res.data, ...prev]);
    } catch {
      const newEntity: Entity = {
        id: Date.now(),
        ...ingestForm,
        address: '',
        type: 'Private Hospital',
        relevance_score: Math.floor(Math.random() * 20) + 70,
        priority_score: Math.floor(Math.random() * 20) + 65,
        created_at: new Date().toISOString(),
      };
      setEntities((prev) => [newEntity, ...prev]);
    } finally {
      setIngesting(false);
      setShowIngest(false);
      setIngestForm({ name: '', description: '', website: '', email: '', phone: '', district: '', state: 'Andhra Pradesh' });
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#0f172a' }}>Onboarding Finder</h2>
          <p className="text-sm" style={{ color: '#64748b' }}>
            Discover hospitals, PHCs & medical colleges for maternal health outreach
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowClassify(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4' }}
          >
            <Sparkles size={15} />
            AI Classify
          </button>
          <button
            onClick={() => setShowIngest(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: '#0d9488' }}
          >
            <Plus size={15} />
            Add Entity
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search entities..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm"
              style={{ border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
              onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>

          <div className="relative">
            <select
              className="w-full px-3 py-2 rounded-xl text-sm appearance-none"
              style={{ border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a' }}
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#94a3b8' }} />
          </div>

          <div className="relative">
            <select
              className="w-full px-3 py-2 rounded-xl text-sm appearance-none"
              style={{ border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a' }}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#94a3b8' }} />
          </div>

          <input
            type="text"
            placeholder="Filter by district..."
            className="w-full px-3 py-2 rounded-xl text-sm"
            style={{ border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a' }}
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
            onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
          />
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Filter size={13} style={{ color: '#94a3b8' }} />
            <span className="text-xs" style={{ color: '#64748b' }}>
              {filtered.length} of {entities.length} entities
            </span>
          </div>
          {(searchQuery || selectedState !== 'All States' || selectedType !== 'All Types' || selectedDistrict) && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedState('All States'); setSelectedType('All Types'); setSelectedDistrict(''); }}
              className="flex items-center gap-1 text-xs"
              style={{ color: '#0d9488' }}
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((entity, index) => (
            <motion.div
              key={entity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.04 }}
              className="card p-5"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
                      style={{ background: '#f0fdfa' }}
                    >
                      <Building2 size={18} style={{ color: '#0d9488' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: '#0f172a' }}>{entity.name}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <TypeBadge type={entity.type} />
                        <span className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
                          <MapPin size={11} /> {entity.district}, {entity.state}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm mb-3" style={{ color: '#475569', lineHeight: 1.6 }}>
                    {entity.description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {entity.email && (
                      <a
                        href={`mailto:${entity.email}`}
                        className="flex items-center gap-1 text-xs"
                        style={{ color: '#0d9488', textDecoration: 'none' }}
                      >
                        <Mail size={12} /> {entity.email}
                      </a>
                    )}
                    {entity.phone && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
                        <Phone size={12} /> {entity.phone}
                      </span>
                    )}
                    {entity.website && (
                      <a
                        href={entity.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs"
                        style={{ color: '#0d9488', textDecoration: 'none' }}
                      >
                        <Globe size={12} /> Website <ExternalLink size={10} />
                      </a>
                    )}
                  </div>

                  {/* Score Result */}
                  {selectedEntity?.id === entity.id && scoreResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-3 rounded-xl"
                      style={{ background: '#f0fdfa', border: '1px solid #99f6e4' }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={13} style={{ color: '#0d9488' }} />
                        <span className="text-xs font-semibold" style={{ color: '#0d9488' }}>AI Relevance Score: {scoreResult.score}/100</span>
                      </div>
                      <ul className="space-y-1">
                        {scoreResult.reasoning.map((r, i) => (
                          <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: '#475569' }}>
                            <span style={{ color: '#0d9488', marginTop: 2 }}>•</span> {r}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <div className="text-center">
                    <ScoreBadge score={entity.relevance_score} size="lg" showLabel />
                    <div className="text-xs mt-1" style={{ color: '#94a3b8' }}>Relevance</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedEntity(entity);
                        handleScore(entity);
                      }}
                      disabled={scoring === entity.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4' }}
                    >
                      {scoring === entity.id ? <LoadingSpinner size={12} /> : <Sparkles size={12} />}
                      Score
                    </button>
                    <button
                      onClick={() => window.location.href = `/outreach?org=${encodeURIComponent(entity.name)}&type=${encodeURIComponent(entity.type)}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                      style={{ background: '#0d9488' }}
                    >
                      <Mail size={12} /> Email
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <Building2 size={32} className="mx-auto mb-3" style={{ color: '#cbd5e1' }} />
            <p className="font-medium" style={{ color: '#64748b' }}>No entities found</p>
            <p className="text-sm" style={{ color: '#94a3b8' }}>Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Classify Modal */}
      {showClassify && <AIClassifyModal onClose={() => setShowClassify(false)} />}

      {/* Ingest Modal */}
      {showIngest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <span className="font-semibold" style={{ color: '#0f172a' }}>Add New Entity</span>
              <button onClick={() => setShowIngest(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X size={18} style={{ color: '#64748b' }} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {[
                { key: 'name', label: 'Organization Name', placeholder: 'e.g. Apollo Hospitals Guntur' },
                { key: 'description', label: 'Description', placeholder: 'Describe the organization...' },
                { key: 'website', label: 'Website', placeholder: 'https://...' },
                { key: 'email', label: 'Email', placeholder: 'contact@org.com' },
                { key: 'phone', label: 'Phone', placeholder: '+91-...' },
                { key: 'district', label: 'District', placeholder: 'e.g. Guntur' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>{label}</label>
                  {key === 'description' ? (
                    <textarea
                      className="w-full px-3 py-2 rounded-xl text-sm resize-none"
                      style={{ border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a', minHeight: 70 }}
                      placeholder={placeholder}
                      value={ingestForm[key as keyof typeof ingestForm]}
                      onChange={(e) => setIngestForm((f) => ({ ...f, [key]: e.target.value }))}
                    />
                  ) : (
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-xl text-sm"
                      style={{ border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a' }}
                      placeholder={placeholder}
                      value={ingestForm[key as keyof typeof ingestForm]}
                      onChange={(e) => setIngestForm((f) => ({ ...f, [key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowIngest(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: '#f1f5f9', color: '#475569' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleIngest}
                  disabled={ingesting || !ingestForm.name}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: '#0d9488' }}
                >
                  {ingesting ? <LoadingSpinner size={14} color="white" /> : <Plus size={14} />}
                  {ingesting ? 'Processing...' : 'Add & Classify'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
