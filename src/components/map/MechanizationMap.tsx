'use client';

import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./MechanizationMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-400">
      Loading Telematics Geospatial Map...
    </div>
  ),
});

export function MechanizationMap({ logs }: { logs: any[] }) {
  return <DynamicMap logs={logs} />;
}
