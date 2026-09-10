// lib/data.ts
// Funciones para cargar y calcular KPIs desde los JSON estáticos.
// En producción esto sería una llamada a API / SharePoint List.
// El patrón fetch() de Next.js cachea automáticamente en el servidor.

import { Cliente, Alerta } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function getClientes(): Promise<Cliente[]> {
  const res = await fetch(`${BASE_URL}/data/clients_summary.json`, {
    cache: 'force-cache', // cached en build time — no recalcula en cada request
  });
  if (!res.ok) throw new Error('No se pudo cargar clients_summary.json');
  return res.json();
}

export async function getAlertas(): Promise<Alerta[]> {
  const res = await fetch(`${BASE_URL}/data/alertas_vencimiento.json`, {
    cache: 'force-cache',
  });
  if (!res.ok) throw new Error('No se pudo cargar alertas_vencimiento.json');
  return res.json();
}

// Calcula KPIs desde el array de clientes
export function calcularKPIs(clientes: Cliente[]) {
  const total = clientes.length;
  const saldoTotal = clientes.reduce((s, c) => s + (c.saldo_total || 0), 0);
  const consumoTotal = clientes.reduce((s, c) => s + (c.consumo_total_tc || 0), 0);
  const multiproducto = clientes.filter(c => c.es_multiproducto).length;

  return {
    totalClientes: total,
    saldoTotal,
    saldoPromedio: total > 0 ? saldoTotal / total : 0,
    consumoTotal,
    consumoPromedio: total > 0 ? consumoTotal / total : 0,
    clientesMultiproducto: multiproducto,
    pctMultiproducto: total > 0 ? (multiproducto / total) * 100 : 0,
  };
}

// Agrupa clientes por Lover type para el gráfico
export function getLoversData(clientes: Cliente[]) {
  const counts: Record<string, number> = {};
  for (const c of clientes) {
    counts[c.lover_type] = (counts[c.lover_type] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

// Agrupa clientes por segmento
export function getSegmentosData(clientes: Cliente[]) {
  const counts: Record<string, number> = {};
  for (const c of clientes) {
    counts[c.segmento_cliente] = (counts[c.segmento_cliente] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

// Valores únicos para los filtros
export function getFilterOptions(clientes: Cliente[]) {
  return {
    segmentos: [...new Set(clientes.map(c => c.segmento_cliente))].sort(),
    ciudades: [...new Set(clientes.map(c => c.ciudad))].sort(),
    productos: [...new Set(clientes.flatMap(c => c.lista_productos.split(', ')))].sort(),
    lovers: [...new Set(clientes.map(c => c.lover_type))].sort(),
  };
}

// Formateadores
export const fmt = {
  currency: (n: number) =>
    new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n),
  number: (n: number) =>
    new Intl.NumberFormat('es-EC').format(Math.round(n)),
  pct: (n: number) => `${n.toFixed(1)}%`,
};
