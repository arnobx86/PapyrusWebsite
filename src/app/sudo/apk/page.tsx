"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, 
  Smartphone, 
  Trash2, 
  Save, 
  Upload, 
  AlertTriangle,
  History,
  Cpu
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
  
  const [apkFiles, setApkFiles] = useState<{
    universal: File | null;
    arm: File | null;
    arm64: File | null;
    x86: File | null;
  }>({
    universal: null,
    arm: null,
    arm64: null,
    x86: null
  });

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

  async function uploadFile(file: File, prefix: string) {
    const fileName = `${newVersion.version_number}_${prefix}_${Date.now()}.apk`;
    const { data, error } = await supabase.storage
      .from('apks')
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('apks')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!apkFiles.universal && !apkFiles.arm && !apkFiles.arm64 && !apkFiles.x86) {
      alert('Please select at least one APK file');
      return;
    }

    setIsUploading(true);
    try {
      let universalUrl = '';
      let armUrl = '';
      let arm64Url = '';
      let x86Url = '';

      if (apkFiles.universal) universalUrl = await uploadFile(apkFiles.universal, 'universal');
      if (apkFiles.arm) armUrl = await uploadFile(apkFiles.arm, 'arm');
      if (apkFiles.arm64) arm64Url = await uploadFile(apkFiles.arm64, 'arm64');
      if (apkFiles.x86) x86Url = await uploadFile(apkFiles.x86, 'x86');

      const { error: dbError } = await supabase.from('app_versions').insert({
        version_number: newVersion.version_number,
        apk_url: universalUrl || arm64Url || armUrl || x86Url, // Fallback
        apk_url_arm: armUrl,
        apk_url_arm64: arm64Url,
        apk_url_x86: x86Url,
        update_type: newVersion.update_type,
        release_notes: newVersion.release_notes,
        is_latest: newVersion.is_latest
      });

      if (dbError) throw dbError;

      alert('Version published successfully!');
      fetchVersions();
      setNewVersion({ version_number: '', update_type: 'soft', release_notes: '', is_latest: true });
      setApkFiles({ universal: null, arm: null, arm64: null, x86: null });
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setIsUploading(false);
    }
  }

  async function deleteVersion(id: string) {
    if (!confirm('Are you sure you want to delete this version?')) return;
    await supabase.from('app_versions').delete().eq('id', id);
    fetchVersions();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-72 bg-[#195243] text-white hidden lg:flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="Papyrus Icon" className="w-10 h-10 rounded-xl" />
            <span className="font-bold text-2xl tracking-tight">Sudo</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link href="/sudo/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Dashboard
          </Link>
          <Link href="/sudo/apk" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl font-medium">
            <Smartphone className="w-5 h-5" /> APK Management
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10 text-center lg:text-left">
           <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">APK Management</h1>
           <p className="text-slate-500 text-lg">Multi-Architecture Deployment Hub</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleUpload} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm sticky top-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#195243]" /> New Release
              </h3>

              <div className="space-y-4">
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Version Number</label>
                   <input 
                    type="text" 
                    placeholder="e.g. 1.0.7"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#195243]"
                    value={newVersion.version_number}
                    onChange={(e) => setNewVersion({...newVersion, version_number: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Universal APK (Optional)</label>
                    <input type="file" accept=".apk" className="text-xs w-full" onChange={(e) => setApkFiles({...apkFiles, universal: e.target.files?.[0] || null})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ARM (v7a)</label>
                    <input type="file" accept=".apk" className="text-xs w-full" onChange={(e) => setApkFiles({...apkFiles, arm: e.target.files?.[0] || null})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ARM64 (v8a)</label>
                    <input type="file" accept=".apk" className="text-xs w-full" onChange={(e) => setApkFiles({...apkFiles, arm64: e.target.files?.[0] || null})} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Update Type</label>
                  <select 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    value={newVersion.update_type}
                    onChange={(e) => setNewVersion({...newVersion, update_type: e.target.value})}
                  >
                    <option value="soft">Soft Update</option>
                    <option value="force">Force Update</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Release Notes</label>
                  <textarea 
                    rows={3}
                    placeholder="Changelog..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                    value={newVersion.release_notes}
                    onChange={(e) => setNewVersion({...newVersion, release_notes: e.target.value})}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="w-full py-3 bg-[#195243] text-white rounded-xl font-bold hover:bg-[#154834] transition-all disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Publish Release"}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
             {versions.map((v) => (
               <div key={v.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold">v{v.version_number}</span>
                        {v.is_latest && <span className="text-[10px] bg-[#195243] text-white px-2 py-0.5 rounded-full uppercase">Latest</span>}
                      </div>
                      <p className="text-sm text-slate-500">{v.release_notes}</p>
                    </div>
                    <button onClick={() => deleteVersion(v.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {v.apk_url && <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">Universal</span>}
                    {v.apk_url_arm && <span className="px-3 py-1 bg-emerald-50 text-[#195243] rounded-full text-xs font-medium flex items-center gap-1"><Cpu className="w-3 h-3" /> ARMv7</span>}
                    {v.apk_url_arm64 && <span className="px-3 py-1 bg-emerald-50 text-[#195243] rounded-full text-xs font-medium flex items-center gap-1"><Cpu className="w-3 h-3" /> ARM64</span>}
                    {v.apk_url_x86 && <span className="px-3 py-1 bg-emerald-50 text-[#195243] rounded-full text-xs font-medium flex items-center gap-1"><Cpu className="w-3 h-3" /> x86_64</span>}
                  </div>
               </div>
             ))}
          </div>
        </div>
      </main>
    </div>
  );
}
