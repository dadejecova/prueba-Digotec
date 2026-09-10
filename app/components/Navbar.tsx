'use client';
// Navbar — componente de navegación lateral
// Se repite en todas las páginas autenticadas

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/clientes',  label: 'Clientes',  icon: '👥' },
  { href: '/alertas',   label: 'Alertas',   icon: '🔔' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('auth_user');
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-56 flex flex-col z-20"
           style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
               style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>📊</div>
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Digotec</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Analytics</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                  style={{
                    background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
                    color: isActive ? '#3b82f6' : 'var(--text-secondary)',
                    borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                  }}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer del nav */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <button onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition-all"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f43f5e')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
          <span>🚪</span> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
