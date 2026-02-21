import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Globe,
  Tag,
  ExternalLink,
  Filter,
  ChevronDown,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { mockFunders } from '../lib/mockData';
import type { Funder } from '../lib/api';
import ScoreBadge from '../components/ScoreBadge';
import TypeBadge from '../components/TypeBadge';

const FUNDER_TYPES = ['All', 'Global Foundation', 'Indian Foundation', 'CSR', 'UN Agency', 'Government Aid'];
const GEOGRAPHIES = ['All', 'Global / India', 'India', 'South India'];

export default function FundingScout() {
  const [funders] = useState<Funder[]>(mockFunders);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedGeo, setSelectedGeo] = useState('All');

  const filtered = funders.filter((f) => {
    const typeMatch = selectedType === 'All' || f.type === selectedType;
    const geoMatch = selectedGeo === 'All' || f.geography === selectedGeo;
    return typeMatch && geoMatch;
  });

  const totalFunding = '$8.2M+';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#0f172a' }}>Funding Scout</h2>
        <p className="text-sm" style={{ color: '#64748b' }}>
          Discover foundations, CSR programs & global grants for maternal health
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Funders', value: funders.length, color: '#059669', bg: '#f0fdf4' },
          { label: 'Avg Grant Size', value: '$450K', color: '#0d9488', bg: '#f0fdfa' },
          { label: 'Total Available', value: totalFunding, color: '#7c3aed', bg: '#faf5ff' },
          { label: 'High Relevance', value: funders.filter((f) => f.relevance_score >= 90).length, color: '#d97706', bg: '#fffbeb' },
        ].map((item) => (
          <div key={item.label} className="card p-4">
            <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</div>
            <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={14} style={{ color: '#64748b' }} />
            <span className="text-sm font-medium" style={{ color: '#374151' }}>Filter by:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {FUNDER_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: selectedType === type ? '#0d9488' : '#f1f5f9',
                  color: selectedType === type ? 'white' : '#475569',
                }}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="relative ml-auto">
            <select
              className="px-3 py-1.5 rounded-xl text-xs appearance-none pr-7"
              style={{ border: '1px solid #e2e8f0', outline: 'none', color: '#475569' }}
              value={selectedGeo}
              onChange={(e) => setSelectedGeo(e.target.value)}
            >
              {GEOGRAPHIES.map((g) => <option key={g}>{g}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#94a3b8' }} />
          </div>
        </div>
      </div>

      {/* Funder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filtered.map((funder, index) => (
            <motion.div
              key={funder.id}
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
                    style={{ background: '#f0fdf4' }}
                  >
                    <DollarSign size={18} style={{ color: '#059669' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: '#0f172a' }}>{funder.name}</h3>
                    <TypeBadge type={funder.type} />
                  </div>
                </div>
                <div className="text-center">
                  <ScoreBadge score={funder.relevance_score} size="sm" />
                  <div className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>Match</div>
                </div>
              </div>

              <p className="text-xs mb-3" style={{ color: '#475569', lineHeight: 1.6 }}>{funder.description}</p>

              {/* Grant Size */}
              {funder.grant_size && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3"
                  style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
                >
                  <TrendingUp size={13} style={{ color: '#059669' }} />
                  <span className="text-xs font-semibold" style={{ color: '#059669' }}>Grant Size: {funder.grant_size}</span>
                  <span className="text-xs ml-auto" style={{ color: '#64748b' }}>{funder.geography}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 mb-3">
                {funder.focus_areas.map((area) => (
                  <span
                    key={area}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                    style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}
                  >
                    <Tag size={9} /> {area}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                {funder.website ? (
                  <a
                    href={funder.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs"
                    style={{ color: '#0d9488', textDecoration: 'none' }}
                  >
                    <Globe size={11} /> {funder.website.replace('https://', '')} <ExternalLink size={9} />
                  </a>
                ) : (
                  <span />
                )}
                <button
                  onClick={() => window.location.href = `/outreach?org=${encodeURIComponent(funder.name)}&type=${encodeURIComponent(funder.type)}`}
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: '#0d9488' }}
                >
                  Apply <ArrowRight size={11} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <DollarSign size={32} className="mx-auto mb-3" style={{ color: '#cbd5e1' }} />
          <p className="font-medium" style={{ color: '#64748b' }}>No funders found</p>
          <p className="text-sm" style={{ color: '#94a3b8' }}>Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
