"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Store, 
  Activity, 
  Plus, 
  ArrowUpRight, 
  Smartphone,
  CheckCircle2,
  Clock,
  History
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalShops: 0,
    activeUsers: 0,
    totalVersions: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [users, shops, members, versions, activity] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('shops').select('id', { count: 'exact', head: true }),
          supabase.from('shop_members').select('id', { count: 'exact', head: true }),
          supabase.from('app_versions').select('id', { count: 'exact', head: true }),
          supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(5)
        ]);

        setStats({
          totalUsers: users.count || 0,
          totalShops: shops.count || 0,
          activeUsers: members.count || 0,
          totalVersions: versions.count || 0
        });

        if (activity.data) {
          setRecentActivity(activity.data);
        }
      } catch (e) {
        console.error('Error fetching stats:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  function _formatTimeAgo(date: Date) {
    const diff = new Date().getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }

  function _getActivityIcon(action: string) {
    const a = action.toLowerCase();
    if (a.includes('sale')) return <ArrowUpRight className="w-4 h-4 text-emerald-500" />;
    if (a.includes('purchase')) return <ArrowUpRight className="w-4 h-4 text-blue-500" />;
    if (a.includes('shop')) return <Store className="w-4 h-4 text-amber-500" />;
    if (a.includes('user')) return <Users className="w-4 h-4 text-purple-500" />;
    return <Activity className="w-4 h-4 text-slate-400" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-[#195243] text-white hidden lg:flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="Papyrus Icon" className="w-10 h-10 rounded-xl" />
            <span className="font-bold text-2xl tracking-tight">Sudo</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link href="/sudo/dashboard" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/sudo/apk" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl font-medium transition-colors">
            <Smartphone className="w-5 h-5" /> APK Management
          </Link>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl font-medium transition-colors">
            <ArrowUpRight className="w-5 h-5" /> View Public Site
          </Link>
        </nav>

        <div className="p-8 border-t border-white/10">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center font-bold">A</div>
             <div>
               <p className="text-sm font-bold">Sudo User</p>
               <p className="text-[10px] text-emerald-300 uppercase tracking-widest">Main Controller</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500">Real-time statistics for Papyrus platform</p>
          </div>
          <Link href="/sudo/apk" className="flex items-center gap-2 px-6 py-3 bg-[#195243] text-white rounded-xl font-bold hover:bg-[#154834] transition-all shadow-lg shadow-[#195243]/20">
            <Plus className="w-5 h-5" /> New Release
          </Link>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Users" value={stats.totalUsers} icon={<Users className="w-6 h-6 text-blue-600" />} color="blue" />
          <StatCard title="Total Shops" value={stats.totalShops} icon={<Store className="w-6 h-6 text-emerald-600" />} color="emerald" />
          <StatCard title="Active Members" value={stats.activeUsers} icon={<Activity className="w-6 h-6 text-amber-600" />} color="amber" />
          <StatCard title="App Versions" value={stats.totalVersions} icon={<History className="w-6 h-6 text-purple-600" />} color="purple" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Recent Activity
              </h3>
              <Link href="#" className="text-xs font-bold text-[#195243] hover:underline uppercase tracking-wider">Expand History</Link>
            </div>
            
            <div className="space-y-6">
              {recentActivity.length > 0 ? recentActivity.map((activity) => (
                <ActivityItem 
                  key={activity.id}
                  title={activity.details?.message || activity.action} 
                  user={activity.user_email?.split('@')[0] || 'System'} 
                  detail={activity.details?.invoice_number || activity.entity_type || ''} 
                  time={_formatTimeAgo(new Date(activity.created_at))} 
                  icon={_getActivityIcon(activity.action)} 
                />
              )) : (
                <p className="text-slate-400 text-sm italic">No recent activity found.</p>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center p-12">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
               <Smartphone className="w-10 h-10 text-slate-400" />
             </div>
             <h3 className="text-2xl font-bold mb-3">App Update Status</h3>
             <p className="text-slate-500 mb-8 max-w-sm">No critical performance issues detected. Current global version is stable.</p>
             <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
               <CheckCircle2 className="w-5 h-5" /> Systems Operational
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">{title}</p>
        <h4 className="text-4xl font-extrabold text-slate-900">{value}</h4>
      </div>
    </div>
  );
}

function ActivityItem({ title, user, detail, time, icon }: { title: string, user: string, detail: string, time: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-100">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <p className="font-bold text-slate-900">{title}</p>
          <p className="text-[10px] font-bold text-slate-300 uppercase flex items-center gap-1">
            <Clock className="w-3 h-3" /> {time}
          </p>
        </div>
        <p className="text-sm text-slate-500"><span className="font-medium text-slate-700">{user}</span> • {detail}</p>
      </div>
    </div>
  );
}

function LayoutDashboard(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
