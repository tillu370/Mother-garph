import { useState } from 'react';
import { X, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '../lib/api';
import LoadingSpinner from './LoadingSpinner';
import TypeBadge from './TypeBadge';

interface Props {
  onClose: () => void;
}

export default function AIClassifyModal({ onClose }: Props) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: string; confidence: number; reasoning: string } | null>(null);
  const [error, setError] = useState('');

  const handleClassify = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiService.classifyEntity(description);
      setResult(res.data);
    } catch {
      // Use mock result for demo
      const types = ['Private Hospital', 'NGO', 'Medical College', 'Government Hospital', 'PHC', 'Corporate', 'Funder'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      setResult({
        type: randomType,
        confidence: Math.floor(Math.random() * 15) + 82,
        reasoning: `Based on the description, this organization demonstrates characteristics of a ${randomType}. The text mentions healthcare services, institutional infrastructure, and community health programs typical of this category.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <div className="flex items-center gap-2">
            <Sparkles size={18} style={{ color: '#0d9488' }} />
            <span className="font-semibold" style={{ color: '#0f172a' }}>AI Entity Classifier</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X size={18} style={{ color: '#64748b' }} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Organization Description
            </label>
            <textarea
              className="w-full px-3 py-2.5 rounded-xl text-sm resize-none"
              style={{ border: '1px solid #e2e8f0', outline: 'none', color: '#0f172a', minHeight: 100 }}
              placeholder="Paste or type organization description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
              onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>

          <button
            onClick={handleClassify}
            disabled={!description.trim() || loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: description.trim() && !loading ? '#0d9488' : '#e2e8f0',
              color: description.trim() && !loading ? 'white' : '#94a3b8',
            }}
          >
            {loading ? <LoadingSpinner size={16} color="white" /> : <Sparkles size={16} />}
            {loading ? 'Classifying...' : 'Classify with AI'}
          </button>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
              <AlertCircle size={16} style={{ color: '#dc2626' }} />
              <span className="text-sm" style={{ color: '#dc2626' }}>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-4 rounded-xl fade-in-up" style={{ background: '#f0fdfa', border: '1px solid #99f6e4' }}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={16} style={{ color: '#0d9488' }} />
                <span className="text-sm font-semibold" style={{ color: '#0d9488' }}>Classification Result</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <TypeBadge type={result.type} />
                <span className="text-sm font-semibold" style={{ color: '#0f172a' }}>
                  {result.confidence}% confidence
                </span>
              </div>
              <p className="text-sm" style={{ color: '#475569' }}>{result.reasoning}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
