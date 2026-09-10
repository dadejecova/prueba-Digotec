// KPICard — tarjeta de métrica reutilizable
// Props: todo por fuera → compatible con SPFx Web Part

interface KPICardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon: string;
  accentColor?: string;
  delay?: number;
}

export default function KPICard({
  label, value, subtitle, icon,
  accentColor = '#3b82f6',
  delay = 0,
}: KPICardProps) {
  return (
    <div className="glow-wrapper animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="glow-bg" style={{ background: accentColor }} />
      <div className="glass-card p-5 h-full">

        {/* Header: icono + label */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-secondary)' }}>
          {label}
        </span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
             style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}30` }}>
          {icon}
        </div>
      </div>

      {/* Valor principal */}
      <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>

      {/* Subtítulo opcional */}
      {subtitle && (
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {subtitle}
        </p>
      )}

      {/* Barra decorativa de color */}
      <div className="mt-3 h-0.5 w-12 rounded-full"
           style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
      </div>
    </div>
  );
}
