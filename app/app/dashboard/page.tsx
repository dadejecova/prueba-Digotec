// Dashboard page — Server Component
// Los Server Components de Next.js ejecutan en el servidor: pueden leer archivos,
// hacer fetch sin CORS, y NO envían JavaScript extra al cliente. Más rápido.

import { getClientes, calcularKPIs, getLoversData } from '@/lib/data';
import { fmt } from '@/lib/data';
import Navbar from '@/components/Navbar';
import KPICard from '@/components/KPICard';
import LoversChart from '@/components/LoversChart';
import PowerBIEmbed from '@/components/PowerBIEmbed';

export const metadata = {
  title: 'Dashboard | Digotec Analytics',
  description: 'Vista ejecutiva de cartera de clientes bancarios',
};

export default async function DashboardPage() {
  const clientes = await getClientes();
  const kpis = calcularKPIs(clientes);
  const loversData = getLoversData(clientes);

  // Próximas alertas de vencimiento (top 5)
  const proximosVenc = clientes
    .filter(c => c.dias_venc_minimo !== null && c.dias_venc_minimo >= 0 && c.dias_venc_minimo <= 90)
    .sort((a, b) => (a.dias_venc_minimo ?? 999) - (b.dias_venc_minimo ?? 999))
    .slice(0, 5);

  const KPI_CONFIG = [
    {
      label: 'Clientes Únicos',
      value: fmt.number(kpis.totalClientes),
      subtitle: 'Cartera total activa',
      icon: '👥',
      color: '#3b82f6',
      delay: 0,
    },
    {
      label: 'Saldo Total Cartera',
      value: fmt.currency(kpis.saldoTotal),
      subtitle: `Promedio ${fmt.currency(kpis.saldoPromedio)} / cliente`,
      icon: '💰',
      color: '#22c55e',
      delay: 100,
    },
    {
      label: 'Consumo TC Total',
      value: fmt.currency(kpis.consumoTotal),
      subtitle: `Promedio ${fmt.currency(kpis.consumoPromedio)} / cliente`,
      icon: '💳',
      color: '#8b5cf6',
      delay: 200,
    },
    {
      label: 'Clientes Multiproducto',
      value: fmt.number(kpis.clientesMultiproducto),
      subtitle: `${fmt.pct(kpis.pctMultiproducto)} de la cartera`,
      icon: '🔗',
      color: '#f59e0b',
      delay: 300,
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Navbar />

      <main className="flex-1 ml-56 p-6 space-y-6">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-xl font-bold gradient-text">Dashboard Ejecutivo</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Cartera de {fmt.number(kpis.totalClientes)} clientes · Actualizado con dataset Digotec
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_CONFIG.map(k => (
            <KPICard key={k.label} {...k} accentColor={k.color} />
          ))}
        </div>

        {/* Gráficos: Lovers + Alertas rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <LoversChart data={loversData} />
          </div>

          {/* Panel de próximos vencimientos */}
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: 'var(--text-secondary)' }}>
              🔔 Próximos Vencimientos
            </h2>
            <div className="space-y-2">
              {proximosVenc.map(c => (
                <div key={c.cliente_id + c.dias_venc_minimo}
                     className="flex items-center justify-between p-2.5 rounded-lg"
                     style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                      {c.nombre_cliente}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {c.segmento_cliente} · {c.ciudad}
                    </p>
                  </div>
                  <span className="badge text-xs"
                        style={{
                          background: (c.dias_venc_minimo ?? 999) <= 30
                            ? 'rgba(244,63,94,0.15)'
                            : 'rgba(245,158,11,0.15)',
                          color: (c.dias_venc_minimo ?? 999) <= 30 ? '#f43f5e' : '#f59e0b',
                        }}>
                    {c.dias_venc_minimo}d
                  </span>
                </div>
              ))}
              <a href="/alertas"
                 className="block text-center text-xs mt-3 py-1.5 rounded-lg transition-colors"
                 style={{ color: '#3b82f6', background: 'rgba(59,130,246,0.08)' }}>
                Ver todas las alertas →
              </a>
            </div>
          </div>
        </div>

        {/* Sección Power BI */}
        <PowerBIEmbed />

        {/* Insights accionables */}
        <div className="glass-card p-5 animate-fade-in-up-delay-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--text-secondary)' }}>
            💡 Insights Accionables
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: '🍔',
                title: 'Food & Supermarket Lover — Mayor Segmento',
                detail: '529 clientes (24%) tienen consumo dominante en alimentación. Oportunidad: cashback en supermercados aliados.',
                color: '#22c55e',
              },
              {
                icon: '💳',
                title: 'Renovación Proactiva de Tarjetas',
                detail: '+1,000 tarjetas vencen en <90 días. Campaña anticipada reduce riesgo de pérdida de producto y mejora retención.',
                color: '#f59e0b',
              },
              {
                icon: '🔗',
                title: 'Cross-selling en Clientes Single-Producto',
                detail: 'Clientes multiproducto tienen 3x más saldo. El 75% de la cartera tiene solo 1 producto: alta oportunidad de vinculación.',
                color: '#8b5cf6',
              },
            ].map(insight => (
              <div key={insight.title} className="p-4 rounded-xl"
                   style={{ background: `${insight.color}0d`, border: `1px solid ${insight.color}25` }}>
                <div className="text-2xl mb-2">{insight.icon}</div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {insight.title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {insight.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
