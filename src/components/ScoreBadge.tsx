interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

function getScoreColor(score: number) {
  if (score >= 90) return { color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' };
  if (score >= 75) return { color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' };
  if (score >= 60) return { color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
  return { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
}

export default function ScoreBadge({ score, size = 'md', showLabel = false }: ScoreBadgeProps) {
  const { color, bg, border } = getScoreColor(score);
  const sizes = {
    sm: { fontSize: 11, padding: '1px 7px', borderRadius: 8 },
    md: { fontSize: 13, padding: '3px 10px', borderRadius: 10 },
    lg: { fontSize: 15, padding: '5px 14px', borderRadius: 12 },
  };

  return (
    <span
      className="inline-flex items-center gap-1 font-bold"
      style={{
        background: bg,
        color,
        border: `1px solid ${border}`,
        ...sizes[size],
      }}
    >
      {score}
      {showLabel && <span className="font-normal opacity-70">/100</span>}
    </span>
  );
}
