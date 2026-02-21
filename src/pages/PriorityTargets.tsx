import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  MapPin,
  Mail,
  ChevronUp,
  ChevronDown,
  Info,
} from 'lucide-react';
import ScoreBadge from '../components/ScoreBadge';
import TypeBadge from '../components/TypeBadge';

// The shape coming from the actual Python backend
interface BackendEntity {
  name: string;
  type: string;
  district: string;
  state: string;
  relevancescore: number;
  priorityscore: number;
}

type SortKey = 'priorityscore' | 'relevancescore' | 'name';
type SortDir = 'asc' | 'desc';

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: '#f1f5f9' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-xs font-medium w-6 text-right" style={{ color: '#475569' }}>{value}</span>
    </div>
  );
}

export default function PriorityTargets() {
  const [entities, setEntities] = useState<BackendEntity[]>([]);
  const [loading, setLoading] = useState(true);

  const [sortKey, setSortKey] = useState<SortKey>('priorityscore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showFormula, setShowFormula] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/priority-ranking')
      .then((res) => res.json())
      .then((data: BackendEntity[]) => {
        // Multiply 0-1 float scores by 100 and round them
        const formattedData = data.map((item) => ({
          ...item,
          priorityscore: Math.round(item.priorityscore * 100),
          relevancescore: Math.round(item.relevancescore * 100),
        }));
        setEntities(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch priority ranking:', err);
        setLoading(false);
      });
  }, []);

  const sorted = [...entities].sort((a, b) => {
    const va = a[sortKey];
    const vb = b[sortKey];
    if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
    return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronDown size={12} style={{ color: '#cbd5e1' }} />;
    return sortDir === 'desc' ? (
      <ChevronDown size={12} style={{ color: '#0d9488' }} />
    ) : (
      <ChevronUp size={12} style={{ color: '#0d9488' }} />
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin mb-4" />
        <p>Loading AI Priority Targets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#0f172a' }}>Priority Targets</h2>
          <p className="text-sm" style={{ color: '#64748b' }}>
            AI-ranked entities by composite priority score
          </p>
        </div>
        <button
          onClick={() => setShowFormula(!showFormula)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          style={{ background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4' }}
        >
          <Info size={14} /> Score Formula
        </button>
      </div>

      {/* Formula Card */}
      {showFormula && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card p-5"
          style={{ background: '#f0fdfa', border: '1px solid #99f6e4' }}
        >
          <h4 className="font-semibold text-sm mb-3" style={{ color: '#0d9488' }}>Priority Score Formula</h4>
          <div
            className="font-mono text-sm p-3 rounded-lg mb-3"
            style={{ background: 'white', border: '1px solid #99f6e4', color: '#0f172a' }}
          >
            priorityscore = (0.5 × relevancescore) + (0.3 × population_score) + (0.2 × partnership_score)
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Relevance Score (50%)', desc: 'AI-scored maternal health relevance, services, and outreach capacity' },
              { label: 'Population Score (30%)', desc: 'District population served, patient volume, and geographic reach' },
              { label: 'Partnership Score (20%)', desc: 'Existing partnerships, government ties, and collaboration history' },
            ].map((item) => (
              <div key={item.label} className="text-xs" style={{ color: '#475569' }}>
                <div className="font-semibold mb-1" style={{ color: '#0f172a' }}>{item.label}</div>
                {item.desc}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Score ≥ 90', count: sorted.filter((e) => e.priorityscore >= 90).length, color: '#059669' },
          { label: 'Score 75–89', count: sorted.filter((e) => e.priorityscore >= 75 && e.priorityscore < 90).length, color: '#0d9488' },
          { label: 'Score < 75', count: sorted.filter((e) => e.priorityscore < 75).length, color: '#d97706' },
        ].map((item) => (
          <div key={item.label} className="card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: item.color }}>{item.count}</div>
            <div className="text-xs" style={{ color: '#64748b' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <th className="text-left px-5 py-3 text-xs font-semibold" style={{ color: '#64748b' }}>#</th>
                <th className="text-left px-5 py-3 text-xs font-semibold" style={{ color: '#64748b' }}>
                  <button onClick={() => handleSort('name')} className="flex items-center gap-1">
                    Organization <SortIcon col="name" />
                  </button>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold" style={{ color: '#64748b' }}>Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold" style={{ color: '#64748b' }}>District</th>
                <th className="text-left px-5 py-3 text-xs font-semibold" style={{ color: '#64748b' }}>
                  <button onClick={() => handleSort('relevancescore')} className="flex items-center gap-1">
                    Relevance <SortIcon col="relevancescore" />
                  </button>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold" style={{ color: '#64748b' }}>
                  <button onClick={() => handleSort('priorityscore')} className="flex items-center gap-1">
                    Priority <SortIcon col="priorityscore" />
                  </button>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold" style={{ color: '#64748b' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entity, index) => (
                <motion.tr
                  key={index} // Fallback to index if API doesn't have an ID
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  style={{ borderBottom: '1px solid #f1f5f9' }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                      style={{
                        background: index < 3 ? '#f0fdfa' : '#f8fafc',
                        color: index < 3 ? '#0d9488' : '#94a3b8',
                      }}
                    >
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {index < 3 && <Star size={13} fill="#f59e0b" style={{ color: '#f59e0b' }} />}
                      <span className="text-sm font-medium" style={{ color: '#0f172a' }}>{entity.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <TypeBadge type={entity.type} />
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
                      <MapPin size={11} /> {entity.district}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="w-32">
                      <ScoreBar value={entity.relevancescore} color="#0d9488" />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <ScoreBadge score={entity.priorityscore} size="sm" showLabel />
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => window.location.href = `/outreach?org=${encodeURIComponent(entity.name)}&type=${encodeURIComponent(entity.type)}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4' }}
                    >
                      <Mail size={11} /> Email
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
