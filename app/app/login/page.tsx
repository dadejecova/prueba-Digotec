'use client';
// Login de demostración.
// "use client" indica que este componente corre en el browser (no en el servidor).
// Necesitamos state y eventos de formulario → siempre en Client Component.

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación mínima para no dejar campos vacíos
    if (!user.trim() || !pass.trim()) {
      setError('Por favor ingresa usuario y contraseña');
      return;
    }

    setLoading(true);

    // Simulamos latencia de auth (500ms) para hacer la demo más realista
    setTimeout(() => {
      // En un entorno real: llamaríamos a Azure AD / MSAL para OAuth
      // Aquí guardamos en sessionStorage para simular sesión activa
      sessionStorage.setItem('auth_user', user);
      router.push('/dashboard');
    }, 500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0f1a2e 50%, #0a0f1e 100%)' }}>

      {/* Orbes de fondo — efecto visual decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
             style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20"
             style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5"
             style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />
      </div>

      {/* Card de login */}
      <div className="glass-card p-8 w-full max-w-md mx-4 animate-fade-in-up relative z-10">

        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
               style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <span className="text-2xl">📊</span>
          </div>
          <h1 className="text-2xl font-bold gradient-text">Digotec Analytics</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Portal de Analítica de Cartera
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Usuario
            </label>
            <input
              id="login-user"
              type="text"
              placeholder="analista@digotec.com"
              value={user}
              onChange={e => setUser(e.target.value)}
              className="dark-input w-full"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Contraseña
            </label>
            <input
              id="login-pass"
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="dark-input w-full"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm px-3 py-2 rounded-lg"
               style={{ color: '#f43f5e', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
              ⚠ {error}
            </p>
          )}

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 mt-2"
            style={{
              background: loading
                ? 'rgba(59,130,246,0.5)'
                : 'linear-gradient(135deg, #3b82f6, #6366f1)',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(59,130,246,0.3)',
            }}>
            {loading ? 'Ingresando...' : 'Ingresar al Dashboard'}
          </button>
        </form>

        <p className="text-xs text-center mt-6" style={{ color: 'var(--text-secondary)' }}>
          Entorno de demostración · Cualquier usuario y contraseña funcionan
        </p>
      </div>
    </main>
  );
}
