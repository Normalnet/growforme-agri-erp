'use client';

import dynamic from 'next/dynamic';
import { MechanizationLog, FarmAsset } from '@/types/schema';

const DynamicMap = dynamic(() => import('./MechanizationMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[480px] bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-400">
      Loading Telematics & GeoJSON Geospatial Map...
    </div>
  ),
});

export function MechanizationMap({
  logs,
  farms,
}: {
  logs: MechanizationLog[];
  farms?: FarmAsset[];
}) {
  return <DynamicMap logs={logs} farms={farms} />;
}
