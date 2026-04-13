"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Download, ArrowLeft, ShieldCheck, RefreshCw, Calendar, Smartphone } from 'lucide-react';

interface AppVersion {
  version_number: string;
  apk_url: string;
  created_at: string;
  release_notes: string;
}

export default function DownloadPage() {
  const [latest, setLatest] = useState<AppVersion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatest() {
      const { data, error } = await supabase
        .from('app_versions')
        .select('*')
        .eq('is_latest', true)
        .single();
      
      if (!error && data) {
        setLatest(data);
      }
      setLoading(false);
    }
    fetchLatest();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="h-20 flex items-center px-6 border-b border-slate-200 bg-white">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-[#195243] transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-20 h-20 bg-[#195243] rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-[#195243]/20">
              <span className="text-white font-bold text-4xl">P</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Download Papyrus
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Get the latest version of Papyrus – Your Digital Khata. Track sales, purchases, and stock on the go.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-200">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#195243]" />
                </div>
                <div>
                  <h3 className="font-bold">Verified Secure</h3>
                  <p className="text-sm text-slate-500">Every APK is scanned for security and reliability.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-200">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold">Android 8.0+ Compatible</h3>
                  <p className="text-sm text-slate-500">Optimized for most modern Android devices.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <RefreshCw className="w-10 h-10 text-[#195243] animate-spin" />
                <p className="text-slate-400 font-medium">Checking for updates...</p>
              </div>
            ) : latest ? (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#195243]/10 text-[#195243] rounded-full text-xs font-bold mb-6">
                  NEW VERSION AVAILABLE
                </div>
                <h2 className="text-5xl font-black text-slate-900 mb-2">v{latest.version_number}</h2>
                <div className="flex items-center justify-center gap-4 text-slate-400 text-sm mb-10">
                  <span className="flex items-center gap-1.5 underline decoration-slate-200"><Calendar className="w-4 h-4" /> {new Date(latest.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>~15 MB</span>
                </div>

                <a 
                  href={latest.apk_url}
                  className="w-full flex items-center justify-center gap-3 py-5 bg-[#195243] text-white rounded-2xl font-bold text-xl hover:bg-[#154834] transition-all shadow-xl shadow-[#195243]/30 mb-8"
                >
                  <Download className="w-6 h-6" /> Download APK
                </a>

                <div className="text-left bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-3">Release Notes</h4>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {latest.release_notes || "Performance improvements and bug fixes."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                  <Smartphone className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">No APK found</h3>
                <p className="text-slate-500 mb-8">Stay tuned! The app will be available for download here shortly.</p>
                <Link href="/" className="text-[#195243] font-bold hover:underline">Notify me when ready</Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm">
        Papyrus Distribution System v1.0
      </footer>
    </div>
  );
}
