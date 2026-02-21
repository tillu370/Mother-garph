import { type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
        style={{ background: '#f0fdfa' }}
      >
        <Icon size={28} style={{ color: '#0d9488' }} />
      </div>
      <h3 className="text-base font-semibold mb-2" style={{ color: '#0f172a' }}>{title}</h3>
      <p className="text-sm max-w-xs" style={{ color: '#64748b' }}>{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
