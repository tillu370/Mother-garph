import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bg: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  delay?: number;
}

export default function StatCard({ title, value, icon: Icon, color, bg, change, changeType, delay = 0 }: StatCardProps) {
  return (
    <div
      className="card p-5 fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: '#64748b' }}>{title}</p>
          <p className="text-3xl font-bold" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>{value}</p>
          {change && (
            <p
              className="text-xs mt-1 font-medium"
              style={{
                color: changeType === 'up' ? '#059669' : changeType === 'down' ? '#dc2626' : '#64748b',
              }}
            >
              {change}
            </p>
          )}
        </div>
        <div
          className="flex items-center justify-center w-11 h-11 rounded-xl"
          style={{ background: bg }}
        >
          <Icon size={22} style={{ color }} />
        </div>
      </div>
    </div>
  );
}
