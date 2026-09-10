'use client';
// LoversChart — donut chart de distribución de Lovers
// Usa Recharts: librería de gráficos construida sobre D3, muy usada en React

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#14b8a6', // teal
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#22c55e', // green
  '#06b6d4', // cyan
  '#a855f7', // violet
];

interface Props {
  data: { name: string; value: number }[];
}

// Tooltip personalizado — mejor UX que el default
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{name: string; value: number; payload: {pct: string}}> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-sm">
      <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{payload[0].name}</p>
      <p style={{ color: 'var(--text-secondary)' }}>
        {payload[0].value} clientes ({payload[0].payload.pct})
      </p>
    </div>
  );
}

export default function LoversChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const enriched = data.map(d => ({ ...d, pct: `${((d.value / total) * 100).toFixed(1)}%` }));

  return (
    <div className="glass-card p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-4"
          style={{ color: 'var(--text-secondary)' }}>
        🎯 Segmentación por Lovers
      </h2>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={enriched}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {enriched.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
