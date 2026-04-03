import { useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import type { AuthUser } from '../types';

interface LoginProps {
  onLogin: (user: AuthUser) => void;
}

const CREDENTIALS: Record<string, { password: string; role: 'admin' | 'user'; name: string }> = {
  admin: { password: 'admin', role: 'admin', name: 'Administrador' },
  user: { password: 'user', role: 'user', name: 'Cajero' },
};

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    setError('');
    setTimeout(() => {
      const cred = CREDENTIALS[username.toLowerCase()];
      if (cred && cred.password === password) {
        onLogin({ name: cred.name, role: cred.role });
      } else {
        setError('Usuario o contraseña incorrectos');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#ff5722]/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff5722]/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#ff5722]/10 rounded-3xl border border-[#ff5722]/25 mb-5 shadow-2xl shadow-[#ff5722]/10">
            <span className="text-5xl">🌯</span>
          </div>
          <h1 className="text-[#f0f0f0] text-3xl tracking-tight">Lomitería</h1>
          <p className="text-[#555] mt-2 text-sm tracking-wide uppercase">Sistema de Punto de Venta</p>
        </div>

        {/* Login card */}
        <div className="bg-[#111111] rounded-2xl border border-[#1e1e1e] p-8 shadow-2xl">
          <h2 className="text-[#d0d0d0] mb-2">Iniciar Sesión</h2>
          <p className="text-sm text-[#444] mb-7">Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#555] mb-2">Usuario</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444]" size={16} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  placeholder="Ingresa tu usuario"
                  autoComplete="username"
                  className="w-full bg-[#161616] border border-[#252525] focus:border-[#ff5722] text-[#f0f0f0] placeholder-[#383838] rounded-xl pl-10 pr-4 py-3.5 focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#555] mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444]" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#161616] border border-[#252525] focus:border-[#ff5722] text-[#f0f0f0] placeholder-[#383838] rounded-xl pl-10 pr-11 py-3.5 focus:outline-none transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#777] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <span className="text-base">⚠️</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-[#ff5722] hover:bg-[#e64a19] disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-[#ff5722]/20 hover:shadow-[#ff5722]/30 mt-2 text-sm tracking-wide"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verificando...
                </span>
              ) : 'Ingresar al Sistema'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#2e2e2e] mt-6">Terminal 01 · Lomitería POS v2.0</p>
      </div>
    </div>
  );
}
