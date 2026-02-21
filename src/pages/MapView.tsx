import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Activity } from 'lucide-react';
import { mockHeatmap } from '../lib/mockData';
import HeatMap from '../components/HeatMap';

export default function MapView() {
  const [data] = useState(mockHeatmap);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#0f172a' }}>Geographic Distribution</h2>
        <p className="text-sm" style={{ color: '#64748b' }}>
          Entity density across Andhra Pradesh & Telangana districts
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={16} style={{ color: '#0d9488' }} />
          <h3 className="font-semibold text-sm" style={{ color: '#0f172a' }}>Maternal Health Entity Heatmap</h3>
        </div>
        <HeatMap data={data} />
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {data.slice(0, 4).map((d) => (
          <div key={d.district} className="card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={13} style={{ color: '#0d9488' }} />
              <span className="text-xs font-medium" style={{ color: '#64748b' }}>{d.district}</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: '#0d9488' }}>{d.count}</div>
            <div className="text-xs" style={{ color: '#94a3b8' }}>entities</div>
          </div>
        ))}
      </div>
    </div>
  );
}
