const typeConfig: Record<string, { color: string; bg: string; border: string }> = {
  'Medical College': { color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
  'Private Hospital': { color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd' },
  'Government Hospital': { color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
  PHC: { color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
  NGO: { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  Corporate: { color: '#475569', bg: '#f8fafc', border: '#e2e8f0' },
  Funder: { color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' },
  'Global Foundation': { color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
  'Indian Foundation': { color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
  'UN Agency': { color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd' },
  CSR: { color: '#475569', bg: '#f8fafc', border: '#e2e8f0' },
  'Government Aid': { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
};

export default function TypeBadge({ type }: { type: string }) {
  const config = typeConfig[type] || { color: '#475569', bg: '#f8fafc', border: '#e2e8f0' };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ color: config.color, background: config.bg, border: `1px solid ${config.border}` }}
    >
      {type}
    </span>
  );
}
