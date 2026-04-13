import React from 'react';
import Link from 'next/link';
import { 
  Package, 
  ArrowRight, 
  Download, 
  ShieldCheck, 
  Wallet,
  Receipt
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#195243] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-[#195243]">Papyrus</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-[#195243] transition-colors">Features</Link>
            <Link href="/download" className="text-sm font-medium px-5 py-2.5 bg-[#195243] text-white rounded-full hover:bg-[#154834] transition-all shadow-lg shadow-[#195243]/20">
              Download App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-[#195243] rounded-full text-xs font-bold tracking-wide uppercase mb-6">
              <span className="flex h-2 w-2 rounded-full bg-[#195243] animate-pulse" />
              Revolutionizing Shop Management
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tight">
              Papyrus – Your <span className="text-[#195243]">Digital Khata</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-lg">
              The all-in-one business management app for small business owners. Track sales, purchases, stock, and transactions with ease.
            </p>
            <div className="flex flex-col sm:row items-center gap-4">
              <Link href="/download" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#195243] text-white rounded-2xl font-bold text-lg hover:bg-[#154834] transition-all transform hover:-translate-y-0.5 shadow-xl shadow-[#195243]/30">
                Download Latest APK <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-slate-400">Available for Android 8.0+</p>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-[600px] bg-gradient-to-br from-[#195243] to-emerald-800 rounded-[40px] shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20 transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute inset-0 flex items-center justify-center p-12">
                 <div className="w-72 h-[560px] bg-slate-900 rounded-[48px] border-[8px] border-slate-800 shadow-2xl flex flex-col items-center overflow-hidden">
                    <div className="w-full h-8 bg-slate-800 flex justify-center items-center pt-2">
                      <div className="w-16 h-1 bg-slate-700 rounded-full" />
                    </div>
                    <div className="flex-1 w-full bg-[#195243] p-6 space-y-4">
                       <div className="h-4 w-2/3 bg-white/20 rounded" />
                       <div className="h-24 w-full bg-white/10 rounded-xl" />
                       <div className="grid grid-cols-2 gap-2">
                         <div className="h-16 bg-white/10 rounded-lg" />
                         <div className="h-16 bg-white/10 rounded-lg" />
                       </div>
                       <div className="h-40 w-full bg-white/10 rounded-xl" />
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-extrabold mb-6 tracking-tight">Everything you need to grow your business</h2>
            <p className="text-lg text-slate-600">Built specifically for small businesses to handle the complexity of daily operations in a simple, digital format.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Receipt className="w-8 h-8 text-blue-600" />}
              title="Sales & Purchase"
              description="Record every transaction with digital invoices. Track income and expenses effortlessly."
            />
            <FeatureCard 
              icon={<Package className="w-8 h-8 text-emerald-600" />}
              title="Stock Management"
              description="Real-time inventory tracking. Get notified when stock is low and manage products."
            />
            <FeatureCard 
              icon={<Wallet className="w-8 h-8 text-amber-600" />}
              title="Len-Den (Credit)"
              description="Manage loans and dues with customers and suppliers. Never forget a payment."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-purple-600" />}
              title="Secure Cloud"
              description="Your data is backed up safely in the cloud. Access it from anywhere, anytime."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 bg-[#195243]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to digitize your business?</h2>
          <p className="text-xl text-emerald-100/80 mb-12 max-w-2xl mx-auto">
            Join thousands of shop owners who are already using Papyrus to streamline their operations.
          </p>
          <Link href="/download" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#195243] rounded-2xl font-bold text-xl hover:bg-emerald-50 transition-all shadow-2xl shadow-black/20">
            <Download className="w-6 h-6" /> Download Papyrus Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
          <div className="flex items-center gap-3 opacity-60">
            <div className="w-8 h-8 bg-[#195243] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-[#195243]">Papyrus</span>
          </div>
          <div className="text-slate-400 text-sm">
            © 2026 Papyrus Digital. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/admin" className="text-sm font-medium text-slate-400 hover:text-[#195243]">Admin Panel</Link>
            <Link href="/" className="text-sm font-medium text-slate-400 hover:text-[#195243]">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-slate-50 rounded-[32px] border border-transparent hover:border-emerald-200 hover:bg-white hover:shadow-xl transition-all group">
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
