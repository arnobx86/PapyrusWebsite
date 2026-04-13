"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, 
  Smartphone, 
  Trash2, 
  Save, 
  Upload, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  History,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

export default function ApkManagement() {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [newVersion, setNewVersion] = useState({
    version_number: '',
    update_type: 'soft',
    release_notes: '',
    is_latest: true
  });
  const [apkFile, setApkFile] = useState<File | null>(null);

  useEffect(() => {
    fetchVersions();
  }, []);

  async function fetchVersions() {
    setLoading(true);
    const { data } = await supabase
      .from('app_versions')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setVersions(data);
    setLoading(false);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!apkFile && !isUploading) {
      alert('Please select an APK file');
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `${newVersion.version_number}_${Date.now()}.apk`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('apks')
        .upload(fileName, apkFile!);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('apks')
        .getPublicUrl(fileName);

      const apkUrl = urlData.publicUrl;

      const { error: dbError } = await supabase.from('app_versions').insert({
        version_number: newVersion.version_number,
        apk_url: apkUrl,
        update_type: newVersion.update_type,
        release_notes: newVersion.release_notes,
        is_latest: newVersion.is_latest
      });

      if (dbError) throw dbError;

      alert('Version published successfully!');
      fetchVersions();
      setNewVersion({ version_number: '', update_type: 'soft', release_notes: '', is_latest: true });
      setApkFile(null);
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setIsUploading(false);
    }
  }

  async function deleteVersion(id: string, apkUrl: string) {
    if (!confirm('Are you sure you want to delete this version?')) return;
    
    // In a real app, also delete from storage
    await supabase.from('app_versions').delete().eq('id', id);
    fetchVersions();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (Same as Dashboard) */}
      <aside className="w-72 bg-[#195243] text-white hidden lg:flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="font-bold text-2xl tracking-tight">Admin</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Dashboard
          </Link>
          <Link href="/admin/apk" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl font-medium">
            <Smartphone className="w-5 h-5" /> APK Management
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10 text-center lg:text-left">
           <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">APK Management</h1>
           <p className="text-slate-500 text-lg">Deploy new updates and maintain version history</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Release Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleUpload} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm sticky top-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#195243]" /> New Release
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Version Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 1.0.1"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#195243] outline-none"
                    value={newVersion.version_number}
                    onChange={(e) => setNewVersion({...newVersion, version_number: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Update Type</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#195243] outline-none"
                    value={newVersion.update_type}
                    onChange={(e) => setNewVersion({...newVersion, update_type: e.target.value})}
                  >
                    <option value="soft">Soft Update (Recommended)</option>
                    <option value="force">Force Update (Critical)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">APK File</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept=".apk"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setApkFile(e.target.files?.[0] || null)}
                    />
                    <div className="w-full px-4 py-10 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 group-hover:border-[#195243] group-hover:bg-emerald-50 transition-all">
                       <Upload className="w-8 h-8 mb-2 group-hover:text-[#195243]" />
                       <p className="text-sm font-medium">{apkFile ? apkFile.name : "Select APK file"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Release Notes</label>
                  <textarea 
                    rows={4}
                    placeholder="What's new in this version?"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#195243] outline-none text-sm"
                    value={newVersion.release_notes}
                    onChange={(e) => setNewVersion({...newVersion, release_notes: e.target.value})}
                  />
                </div>

                <div className="flex items-center gap-2">
                   <input 
                    type="checkbox" 
                    id="is_latest" 
                    checked={newVersion.is_latest}
                    onChange={(e) => setNewVersion({...newVersion, is_latest: e.target.checked})}
                   />
                   <label htmlFor="is_latest" className="text-sm font-bold text-slate-700">Set as Latest Version</label>
                </div>

                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="w-full py-4 bg-[#195243] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#154834] transition-all"
                >
                  {isUploading ? "Uploading..." : <><Save className="w-5 h-5" /> Publish Release</>}
                </button>
              </div>
            </form>
          </div>

          {/* Version List */}
          <div className="lg:col-span-2 space-y-4">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
               <History className="w-5 h-5 text-slate-400" /> Release History
             </h3>

             {loading ? (
               <div className="text-center py-20 bg-white rounded-[32px] border border-slate-200 shadow-sm">
                  <p className="text-slate-400 animate-pulse">Loading version history...</p>
               </div>
             ) : versions.map((v) => (
               <div key={v.id} className={`bg-white p-6 rounded-3xl border ${v.is_latest ? 'border-[#195243]' : 'border-slate-200'} shadow-sm flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${v.is_latest ? 'bg-emerald-100 text-[#195243]' : 'bg-slate-100 text-slate-500'}`}>
                      {v.version_number}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900">v{v.version_number}</p>
                        {v.is_latest && <span className="text-[10px] font-black bg-[#195243] text-white px-2 py-0.5 rounded-full uppercase">Latest</span>}
                        {v.update_type === 'force' && <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" /> Force</span>}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{new Date(v.created_at).toLocaleDateString()} • {v.release_notes}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={v.apk_url} target="_blank" className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#195243] rounded-xl border border-slate-100 transition-all">
                      <Upload className="w-5 h-5" />
                    </a>
                    <button 
                      onClick={() => deleteVersion(v.id, v.apk_url)}
                      className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl border border-slate-100 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </main>
    </div>
  );
}
