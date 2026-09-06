'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await api.login({ email, password });
      if (data.token) {
        localStorage.setItem('portfolio_token', data.token);
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid administrator credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 pt-24 pb-16">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to public portfolio
        </Link>

        {/* Login Card */}
        <div className="rounded-2xl bg-[#18181b] border border-white/10 p-8 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-[#FF5500]/15 to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Admin Console</h2>
              <p className="text-xs text-[#A1A1AA]">Manage projects, skills, and contacts</p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs mb-6 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@portfolio.dev"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5500] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="????????????"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5500] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#FF5500] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#A32A17] shadow-lg shadow-[#FF5500]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                </>
              ) : (
                'Authenticate'
              )}
            </button>
          </form>

          {/* Seed credentials hint */}
          <div className="mt-6 pt-5 border-t border-white/5 text-[11px] text-[#A1A1AA] text-center">
            Seeded test credentials: <br />
            <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded">admin@portfolio.dev</code> /{' '}
            <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded">AdminSecretPass123!</code>
          </div>
        </div>
      </div>
    </div>
  );
}
