// PowerBIEmbed — sección placeholder documentada técnicamente
// El PDF dice: si no puedes embeber, deja la estructura y documenta qué necesitarías.
// Este componente muestra exactamente eso: la arquitectura técnica de integración.

export default function PowerBIEmbed() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
             style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
          📈
        </div>
        <div>
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Dashboard Power BI Embebido
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Integración preparada — pendiente de credenciales corporativas
          </p>
        </div>
      </div>

      {/* Área visual del placeholder */}
      <div className="rounded-xl flex flex-col items-center justify-center py-12 px-6 text-center"
           style={{
             background: 'rgba(245,158,11,0.05)',
             border: '2px dashed rgba(245,158,11,0.3)',
             minHeight: 280,
           }}>
        <span className="text-5xl mb-4">📊</span>
        <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Reporte Power BI — Área Reservada
        </p>
        <p className="text-sm max-w-sm" style={{ color: 'var(--text-secondary)' }}>
          El componente de integración está implementado. Para activarlo se necesitan:
        </p>

        {/* Requisitos técnicos */}
        <div className="mt-4 text-left space-y-2 max-w-sm w-full">
          {[
            { icon: '🔑', label: 'Azure AD App Registration', detail: 'Client ID + Client Secret' },
            { icon: '🏢', label: 'Power BI Workspace ID', detail: 'GUID del workspace corporativo' },
            { icon: '📋', label: 'Report ID', detail: 'GUID del reporte publicado en Power BI Service' },
            { icon: '👤', label: 'Licencia Power BI Pro', detail: 'O Premium Per User para embed externo' },
          ].map(req => (
            <div key={req.label} className="flex items-start gap-2 p-2 rounded-lg"
                 style={{ background: 'rgba(0,0,0,0.2)' }}>
              <span className="text-sm mt-0.5">{req.icon}</span>
              <div>
                <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{req.label}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{req.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Librería que usaríamos */}
        <div className="mt-4 px-3 py-2 rounded-lg text-xs font-mono"
             style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>
          npm install powerbi-client-react
        </div>
      </div>

      {/* Nota técnica del flujo */}
      <div className="mt-4 px-4 py-3 rounded-lg text-xs"
           style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', color: 'var(--text-secondary)' }}>
        <strong style={{ color: 'var(--text-primary)' }}>Flujo de integración:</strong>
        {' '}Backend genera un embed token via Azure AD → frontend usa{' '}
        <code className="px-1 rounded" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
          {'<PowerBIEmbed>'}
        </code>{' '}
        de powerbi-client-react → el iframe del reporte carga con ese token. Compatible con SPFx.
      </div>
    </div>
  );
}
