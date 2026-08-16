'use client';

import DashboardLayout from '../layout-wrapper';
import { MessageSquare, Bell, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function MessagesPage() {
  const alerts = [
    { id: 1, title: 'MoMo Settlement Executed', desc: 'GH₵ 2,010,000 disbursed to 870 maize outgrowers in Nyankpala cluster.', date: 'Today, 02:30 PM', type: 'success' },
    { id: 2, title: 'Tractor Telematics Offline Alert', desc: 'Equipment #4 in Savelugu stopped sending GPS coordinates.', date: 'Today, 11:15 AM', type: 'warning' },
    { id: 3, title: 'GCX Off-taker Contract Fulfilled', desc: 'Contract #GCX-MAIZE-2026-101 reached 350 MT delivered.', date: 'Yesterday', type: 'info' },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
            <MessageSquare className="w-4 h-4" />
            System Utility / Communications
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Messages & Alerts</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time SMS/USSD notification logs, field agent dispatches, and automated payment receipts.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((a) => (
          <div key={a.id} className="glass-card p-5 rounded-2xl border border-slate-800 flex items-start gap-4">
            <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-white text-base">{a.title}</h4>
                <span className="text-xs text-slate-400">{a.date}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{a.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
