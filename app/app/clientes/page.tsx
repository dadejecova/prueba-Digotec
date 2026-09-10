'use client';
// Página de clientes — Client Component porque maneja estado de filtros
// Los filtros son interactivos (cambian en tiempo real), no los puede manejar el servidor.

import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { Cliente } from '@/lib/types';
import { fmt } from '@/lib/data';

// Colores por Lover type
const LOVER_COLORS: Record<string, string> = {
  'Food & Supermarket Lover':         '#22c55e',
  'Tech Lover':                        '#3b82f6',
  'Travel Lover':                      '#14b8a6',
  'Entertainment & Streaming Lover':   '#8b5cf6',
  'Health & Wellness Lover':           '#f43f5e',
  'Education Lover':                   '#f59e0b',
  'Lifestyle Lover':                   '#06b6d4',
  'Sin Perfil de Consumo':             '#64748b',
};

const SEGMENT_COLORS: Record<string, string> = {
  'Mass':      '#3b82f6',
  'Premium':   '#8b5cf6',
  'Affluent':  '#f59e0b',
  'Joven':     '#22c55e',
  'PyME':      '#14b8a6',
};

const PAGE_SIZE = 20;

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de filtros — los 4 filtros pedidos por el PDF
  const [filterSegmento, setFilterSegmento] = useState('');
  const [filterCiudad, setFilterCiudad] = useState('');
  const [filterProducto, setFilterProducto] = useState('');
  const [filterLover, setFilterLover] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetch('/data/clients_summary.json')
      .then(r => r.json())
      .then((data: Cliente[]) => {
        setClientes(data);
        setLoading(false);
      });
  }, []);

  // Opciones únicas para cada filtro
  const options = useMemo(() => ({
    segmentos: [...new Set(clientes.map(c => c.segmento_cliente))].sort(),
    ciudades:  [...new Set(clientes.map(c => c.ciudad))].sort(),
    productos: [...new Set(clientes.flatMap(c => c.lista_productos.split(', ')))].sort(),
    lovers:    [...new Set(clientes.map(c => c.lover_type))].sort(),
  }), [clientes]);

  // Filtrado reactivo — se recalcula cada vez que cambia un filtro
  const filtered = useMemo(() => {
    return clientes.filter(c => {
      if (filterSegmento && c.segmento_cliente !== filterSegmento) return false;
      if (filterCiudad   && c.ciudad !== filterCiudad) return false;
      if (filterLover    && c.lover_type !== filterLover) return false;
      if (filterProducto && !c.lista_productos.includes(filterProducto)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!c.cliente_id.toLowerCase().includes(q) && !c.nombre_cliente.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [clientes, filterSegmento, filterCiudad, filterLover, filterProducto, searchQuery]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const resetFilters = () => {
    setFilterSegmento(''); setFilterCiudad('');
    setFilterProducto(''); setFilterLover('');
    setSearchQuery(''); setPage(1);
  };

  if (loading) return (
    <div className="flex min-h-screen">
      <Navbar />
      <main className="flex-1 ml-56 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p style={{ color: 'var(--text-secondary)' }}>Cargando clientes...</p>
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
          <h1 className="text-xl font-bold gradient-text">Cartera de Clientes</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {filtered.length.toLocaleString('es-EC')} de {clientes.length.toLocaleString('es-EC')} clientes
          </p>
        </div>

        {/* Barra de filtros */}
        <div className="glass-card p-4 animate-fade-in-up-delay-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Búsqueda libre */}
            <input
              id="search-cliente"
              placeholder="🔍 Buscar ID o nombre..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              className="dark-input"
            />

            {/* Filtro 1: Segmento */}
            <select id="filter-segmento" value={filterSegmento}
                    onChange={e => { setFilterSegmento(e.target.value); setPage(1); }}
                    className="dark-input">
              <option value="">Todos los segmentos</option>
              {options.segmentos.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Filtro 2: Ciudad */}
            <select id="filter-ciudad" value={filterCiudad}
                    onChange={e => { setFilterCiudad(e.target.value); setPage(1); }}
                    className="dark-input">
              <option value="">Todas las ciudades</option>
              {options.ciudades.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Filtro 3: Producto */}
            <select id="filter-producto" value={filterProducto}
                    onChange={e => { setFilterProducto(e.target.value); setPage(1); }}
                    className="dark-input">
              <option value="">Todos los productos</option>
              {options.productos.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            {/* Filtro 4: Lover */}
            <select id="filter-lover" value={filterLover}
                    onChange={e => { setFilterLover(e.target.value); setPage(1); }}
                    className="dark-input">
              <option value="">Todos los Lovers</option>
              {options.lovers.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Chips de filtros activos */}
          {(filterSegmento || filterCiudad || filterProducto || filterLover || searchQuery) && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Filtros activos:</span>
              {[filterSegmento, filterCiudad, filterProducto, filterLover, searchQuery]
                .filter(Boolean).map(f => (
                <span key={f} className="badge text-xs"
                      style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
                  {f}
                </span>
              ))}
              <button onClick={resetFilters}
                      className="text-xs px-2 py-0.5 rounded transition-colors"
                      style={{ color: '#f43f5e', background: 'rgba(244,63,94,0.1)' }}>
                Limpiar ×
              </button>
            </div>
          )}
        </div>

        {/* Tabla */}
        <div className="glass-card overflow-hidden animate-fade-in-up-delay-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border)' }}>
                  {['ID', 'Nombre', 'Segmento', 'Ciudad', 'Saldo Total', 'Consumo TC', 'Lover', 'Productos'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-secondary)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((c, i) => (
                  <tr key={c.cliente_id}
                      style={{
                        borderBottom: '1px solid rgba(42,58,92,0.4)',
                        background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.1)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.07)')}
                      onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.1)')}>

                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {c.cliente_id}
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                      {c.nombre_cliente}
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge"
                            style={{
                              background: `${SEGMENT_COLORS[c.segmento_cliente] || '#64748b'}20`,
                              color: SEGMENT_COLORS[c.segmento_cliente] || '#64748b',
                            }}>
                        {c.segmento_cliente}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {c.ciudad}
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: '#22c55e' }}>
                      {fmt.currency(c.saldo_total)}
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                      {c.consumo_total_tc > 0 ? fmt.currency(c.consumo_total_tc) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge text-xs"
                            style={{
                              background: `${LOVER_COLORS[c.lover_type] || '#64748b'}15`,
                              color: LOVER_COLORS[c.lover_type] || '#64748b',
                            }}>
                        {c.lover_type.replace(' Lover', '').replace('Sin Perfil de Consumo', 'Sin Perfil')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)', maxWidth: 160 }}>
                      <span title={c.lista_productos} className="truncate block max-w-[140px]">
                        {c.lista_productos}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between px-4 py-3"
               style={{ borderTop: '1px solid var(--border)' }}>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Página {page} de {totalPages} · {filtered.length} resultados
            </span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      className="px-3 py-1.5 rounded-lg text-xs transition-all"
                      style={{
                        background: page === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(59,130,246,0.15)',
                        color: page === 1 ? 'var(--text-secondary)' : '#3b82f6',
                        cursor: page === 1 ? 'not-allowed' : 'pointer',
                      }}>
                ← Anterior
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="px-3 py-1.5 rounded-lg text-xs transition-all"
                      style={{
                        background: page === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(59,130,246,0.15)',
                        color: page === totalPages ? 'var(--text-secondary)' : '#3b82f6',
                        cursor: page === totalPages ? 'not-allowed' : 'pointer',
                      }}>
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
