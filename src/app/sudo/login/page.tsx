"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, LayoutDashboard, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, use Supabase Auth. 
    // For this quick setup, we verify against the server-side env var via a simple API.
    const res = await fetch('/api/sudo/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/sudo/dashboard');
    } else {
      setError('Invalid sudo password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#195243] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#195243]/20">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Papyrus Sudo</h1>
          <p className="text-slate-500 mt-2">Sign in to manage your app platform</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-10 rounded-[32px] shadow-2xl shadow-slate-200 border border-slate-100">
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3" htmlFor="password">
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="password"
                type="password"
                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#195243] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-6 text-center font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-4 bg-[#195243] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#154834] transition-all transform hover:-translate-y-0.5 shadow-xl shadow-[#195243]/20"
          >
            Access Dashboard <LayoutDashboard className="w-5 h-5" />
          </button>
        </form>
        
        <p className="text-center mt-8 text-slate-400 text-xs">
          Secure Administrator Access Only
        </p>
      </div>
    </div>
  );
}
