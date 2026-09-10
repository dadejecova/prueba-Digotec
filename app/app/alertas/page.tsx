'use client';
// Página de alertas — tarjetas próximas a vencer
// Útil para el negocio: permite acción comercial proactiva

import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { Alerta } from '@/lib/types';
import { fmt } from '@/lib/data';

function UrgencyBadge({ dias }: { dias: number }) {
  if (dias <= 15) return (
    <span className="badge" style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e' }}>
      🔴 Crítico — {dias}d
    </span>
  );
  if (dias <= 30) return (
    <span className="badge" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
      🟡 Urgente — {dias}d
    </span>
  );
  return (
    <span className="badge" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
      🔵 Próximo — {dias}d
    </span>
  );
}

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSegmento, setFilterSegmento] = useState('');
  const [filterUrgencia, setFilterUrgencia] = useState('');

  useEffect(() => {
    fetch('/data/alertas_vencimiento.json')
      .then(r => r.json())
      .then((data: Alerta[]) => {
        setAlertas(data.sort((a, b) => a.dias_para_vencimiento - b.dias_para_vencimiento));
        setLoading(false);
      });
  }, []);

  const segmentos = [...new Set(alertas.map(a => a.segmento_cliente))].sort();

  const filtered = useMemo(() => {
    return alertas.filter(a => {
      if (filterSegmento && a.segmento_cliente !== filterSegmento) return false;
      if (filterUrgencia === 'critico' && a.dias_para_vencimiento > 15) return false;
      if (filterUrgencia === 'urgente' && (a.dias_para_vencimiento <= 15 || a.dias_para_vencimiento > 30)) return false;
      if (filterUrgencia === 'proximo' && a.dias_para_vencimiento <= 30) return false;
      return true;
    });
  }, [alertas, filterSegmento, filterUrgencia]);

  // Conteos por urgencia
  const criticos = alertas.filter(a => a.dias_para_vencimiento <= 15).length;
  const urgentes = alertas.filter(a => a.dias_para_vencimiento > 15 && a.dias_para_vencimiento <= 30).length;
  const proximos = alertas.filter(a => a.dias_para_vencimiento > 30).length;

  if (loading) return (
    <div className="flex min-h-screen">
      <Navbar />
      <main className="flex-1 ml-56 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p style={{ color: 'var(--text-secondary)' }}>Cargando alertas...</p>
        </div>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <Navbar />

      <main className="flex-1 ml-56 p-6 space-y-5">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-xl font-bold gradient-text">Panel de Alertas</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Tarjetas de Crédito con vencimiento en los próximos 90 días
          </p>
        </div>

        {/* KPIs de alertas */}
        <div className="grid grid-cols-3 gap-4 animate-fade-in-up-delay-1">
          {[
            { label: 'Crítico (≤15 días)', value: criticos, color: '#f43f5e', icon: '🔴' },
            { label: 'Urgente (16–30 días)', value: urgentes, color: '#f59e0b', icon: '🟡' },
            { label: 'Próximo (31–90 días)', value: proximos, color: '#3b82f6', icon: '🔵' },
          ].map(k => (
            <div key={k.label} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>{k.icon}</span>
                <span className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--text-secondary)' }}>{k.label}</span>
              </div>
              <p className="text-3xl font-bold" style={{ color: k.color }}>
                {k.value.toLocaleString('es-EC')}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>tarjetas</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="glass-card p-4 flex gap-3 flex-wrap animate-fade-in-up-delay-2">
          <select value={filterSegmento} onChange={e => setFilterSegmento(e.target.value)}
                  className="dark-input" id="alert-filter-segmento">
            <option value="">Todos los segmentos</option>
            {segmentos.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterUrgencia} onChange={e => setFilterUrgencia(e.target.value)}
                  className="dark-input" id="alert-filter-urgencia">
            <option value="">Todas las urgencias</option>
            <option value="critico">🔴 Crítico (≤15 días)</option>
            <option value="urgente">🟡 Urgente (16–30 días)</option>
            <option value="proximo">🔵 Próximo (31–90 días)</option>
          </select>
          <span className="flex items-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            {filtered.length} alertas
          </span>
        </div>

        {/* Lista de alertas */}
        <div className="space-y-2 animate-fade-in-up-delay-3">
          {filtered.slice(0, 50).map((a, i) => (
            <div key={`${a.cliente_id}-${i}`}
                 className="glass-card p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                     style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
                  {a.nombre_cliente.slice(-2)}
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                    {a.nombre_cliente}
                    <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-secondary)' }}>
                      · {a.cliente_id}
                    </span>
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {a.segmento_cliente} · {a.ciudad} · Vence: {new Date(a.fecha_vencimiento).toLocaleDateString('es-EC')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Cupo</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {a.cupo_credito ? fmt.currency(a.cupo_credito) : '—'}
                  </p>
                </div>
                <UrgencyBadge dias={a.dias_para_vencimiento} />
              </div>
            </div>
          ))}

          {filtered.length > 50 && (
            <p className="text-center text-sm py-3" style={{ color: 'var(--text-secondary)' }}>
              Mostrando 50 de {filtered.length} alertas
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
