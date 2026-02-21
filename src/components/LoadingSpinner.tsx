export default function LoadingSpinner({ size = 24, color = '#0d9488' }: { size?: number; color?: string }) {
  return (
    <div
      className="inline-block rounded-full border-2 border-t-transparent animate-spin"
      style={{ width: size, height: size, borderColor: `${color}40`, borderTopColor: color }}
    />
  );
}
