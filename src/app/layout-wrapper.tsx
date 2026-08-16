'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Sidebar />
      <div className="pl-72 flex-1 flex flex-col transition-all duration-300">
        <Header />
        <main className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">{children}</main>

        {/* Global Footer */}
        <footer className="border-t border-slate-800/80 bg-[#0B1120] py-6 px-8 text-center text-xs text-slate-400">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
            <div>
              © {new Date().getFullYear()} <strong className="text-white">GrowForMe Agri Finance Management System</strong>. Developed by{' '}
              <span className="text-emerald-400 font-bold">SmartMusto</span> for <strong className="text-white">GrowForMe</strong>. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-slate-500 text-[11px]">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Enterprise SLA</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
