'use client';

import { useState } from 'react';
import DashboardLayout from '../layout-wrapper';
import { useAppState } from '@/context/AppStateContext';
import { FileText, Download, ShieldCheck, CheckCircle2, Building2, UserCheck, ShoppingBag, Eye, X, Printer, Sprout, Award, MapPin, Calendar } from 'lucide-react';

export default function DocumentsPage() {
  const { partners, tradeOrders, harvestBatches } = useAppState();
  const [activePreviewDoc, setActivePreviewDoc] = useState<{
    title: string;
    docType: 'SLA' | 'TRADE' | 'EUDR';
    data: any;
  } | null>(null);

  const handleDownloadDoc = (title: string, contentStr: string) => {
    const blob = new Blob([contentStr], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    link.download = `${sanitizedTitle}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <FileText className="w-4 h-4" />
            System Utility / Connected Legal Document & Contract Vault
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Documents & Contracts</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time generated legal contracts, partner SLAs, warehouse intake receipts, and EUDR compliance certificates.
          </p>
        </div>
      </div>

      {/* Connected Document Repositories */}
      <div className="space-y-6">
        {/* Category 1: Partner SLAs & Vetting Agreements */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            Partner Service Level Agreements (SLAs) ({partners.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partners.map((p) => {
              const docContent = `================================================================================
GROWFORME AGRIBUSINESS ERP - SERVICE LEVEL AGREEMENT (SLA)
================================================================================
DOCUMENT ID: SLA-GFM-${p.id.toUpperCase()}
ISSUANCE DATE: ${new Date().toISOString().split('T')[0]}

PARTNER DETAILS:
----------------
Company / Partner Name: ${p.name}
Category: ${p.category}
HQ Location: ${p.location}
Contact Person: ${p.contactPerson} (${p.phone} | ${p.email})

ALGORITHMIC VETTING PERFORMANCE:
--------------------------------
Official Vetting Score: ${p.complianceScore}%
SLA Status: ${p.slaStatus}
Aggregated Contracts Value: GHS ${p.totalContractsGHS.toLocaleString()}

TERMS & BINDING CONDITIONS:
1. ESG & Fair Trade: Partner commits to zero child labor and fair outgrower pricing.
2. Digital Traceability: Full waybill and voucher logging required for all transactions.
3. Quality Standards: Moisture content for grain deliverables must remain under 13.0%.

ISSUED BY: GrowForMe Agri Finance Management System
VERIFICATION STAMP: DIGITAL SIGNATURE VALID & ENTERPRISE APPROVED
================================================================================`;

              return (
                <div key={p.id} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white text-sm">{p.name} - Executed SLA</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Category: {p.category} • Vetting Score: <strong className="text-emerald-400">{p.complianceScore}%</strong>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-mono">Location: {p.location}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setActivePreviewDoc({
                          title: `${p.name} Service Level Agreement`,
                          docType: 'SLA',
                          data: p,
                        })
                      }
                      className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Eye className="w-4 h-4 text-emerald-400" />
                      <span>View Legal Doc</span>
                    </button>
                    <button
                      onClick={() => handleDownloadDoc(`${p.name}_SLA`, docContent)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category 2: Off-Taker Trade Contracts */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            Off-Taker Trade Exchange Contracts ({tradeOrders.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tradeOrders.map((trd) => {
              const docContent = `================================================================================
GROWFORME COMMODITY EXCHANGE - OFF-TAKER TRADE CONTRACT
================================================================================
CONTRACT REFERENCE: #${trd.contractNo}
EXECUTION DATE: ${new Date().toISOString().split('T')[0]}

CONTRACT PARTIES:
-----------------
Buyer / Off-Taker: ${trd.offtakerName} (${trd.offtakerType})
Seller / Facilitator: GrowForMe Agri Outgrower Federation

COMMODITY & FINANCIAL SPECIFICATIONS:
-------------------------------------
Commodity Name: ${trd.commodity}
Contract Volume: ${trd.quantityMT} Metric Tons (${trd.quantityMT * 20} Bags of 50kg)
Contract Price: GHS ${trd.pricePerMTGHS.toLocaleString()} per MT
Total Contract Value: GHS ${trd.totalValueGHS.toLocaleString()}
Contract Type: ${trd.contractType}
Delivery Deadline: ${trd.deliveryDeadline}
Fulfillment Status: ${trd.status} (${trd.fulfilledQuantityMT} MT Delivered)

SETTLEMENT TERMS:
Payment released via 4-tier escrow waterfall upon warehouse receipt validation.
================================================================================`;

              return (
                <div key={trd.id} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white text-sm">Contract #{trd.contractNo}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Off-Taker: <strong className="text-slate-200">{trd.offtakerName}</strong> ({trd.contractType})
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-mono">
                      Volume: {trd.quantityMT} MT {trd.commodity} • Total: GH₵ {trd.totalValueGHS.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setActivePreviewDoc({
                          title: `Trade Contract #${trd.contractNo}`,
                          docType: 'TRADE',
                          data: trd,
                        })
                      }
                      className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Eye className="w-4 h-4 text-blue-400" />
                      <span>View Legal Doc</span>
                    </button>
                    <button
                      onClick={() => handleDownloadDoc(`Contract_${trd.contractNo}`, docContent)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs font-bold text-blue-400 hover:bg-blue-500 hover:text-slate-950 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category 3: EUDR Deforestation Certificates & WHR Receipts */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            EUDR Deforestation Compliance & Warehouse Receipts ({harvestBatches.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {harvestBatches.map((hb) => {
              const docContent = `================================================================================
EUROPEAN UNION DEFORESTATION REGULATION (EUDR) COMPLIANCE CERTIFICATE
================================================================================
CERTIFICATE NO: ${hb.warehouseReceiptNo}
BATCH ID: ${hb.batchNo}
DATE OF HARVEST: ${hb.dateHarvested}

PRODUCER & GEOSPATIAL DETAILS:
------------------------------
Outgrower Farmer: ${hb.farmerName}
Commodity Harvested: ${hb.crop} (${hb.qualityGrade})
Total Batch Weight: ${hb.actualYieldKg.toLocaleString()} Kg

AGRONOMIC QUALITY ANALYSIS:
---------------------------
Moisture Content: ${hb.moistureContentPct}% (Max Permissible: 13.0%)
Foreign Matter: ${hb.foreignMatterPct}%
Aflatoxin Level: ${hb.aflatoxinPpb} ppb (Certified Safe)

EUDR GEOSPATIAL DEFORESTATION AUDIT:
------------------------------------
GPS Farm Polygon Verification: CERTIFIED ZERO-DEFORESTATION
Land Tenure Clearance: APPROVED FREEHOLD / LEASEHOLD
Export Clearance: AUTHORIZED FOR GCX & EUROPEAN UNION DESTINATIONS
================================================================================`;

              return (
                <div key={hb.id} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white text-sm">{hb.warehouseReceiptNo}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Farmer: <strong className="text-slate-200">{hb.farmerName}</strong> • {hb.crop} ({hb.qualityGrade})
                    </div>
                    <div className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      EUDR Deforestation Polygon Verified
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setActivePreviewDoc({
                          title: `EUDR Certificate ${hb.warehouseReceiptNo}`,
                          docType: 'EUDR',
                          data: hb,
                        })
                      }
                      className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Eye className="w-4 h-4 text-emerald-400" />
                      <span>View Certificate</span>
                    </button>
                    <button
                      onClick={() => handleDownloadDoc(`EUDR_Cert_${hb.warehouseReceiptNo}`, docContent)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Styled Printable Legal Document Viewer Modal */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl p-8 space-y-6 shadow-2xl my-8 relative">
            <button
              onClick={() => setActivePreviewDoc(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Document Header Branding */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-slate-950 shadow-lg">
                  <Sprout className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">GrowForMe Enterprise ERP</h2>
                  <p className="text-xs text-emerald-400 font-semibold">Official Legal Certificate & SLA Vault</p>
                </div>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-mono">
                  {activePreviewDoc.docType} DOCUMENT
                </span>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">Date: {new Date().toISOString().split('T')[0]}</div>
              </div>
            </div>

            {/* Render 1: Partner SLA Legal Template */}
            {activePreviewDoc.docType === 'SLA' && (
              <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800 space-y-5 text-slate-200 text-xs">
                <div className="text-center space-y-1 border-b border-slate-800 pb-4">
                  <h3 className="text-lg font-extrabold text-white uppercase">SERVICE LEVEL AGREEMENT (SLA)</h3>
                  <div className="text-xs text-amber-400 font-bold">Ref: SLA-GFM-{activePreviewDoc.data.id.toUpperCase()}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Partner Company:</span>
                    <strong className="text-white text-sm block">{activePreviewDoc.data.name}</strong>
                    <span className="text-slate-400 mt-1 block">Category: {activePreviewDoc.data.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">HQ Location:</span>
                    <strong className="text-white text-sm block">{activePreviewDoc.data.location}</strong>
                    <span className="text-slate-400 mt-1 block">Contact: {activePreviewDoc.data.contactPerson} ({activePreviewDoc.data.phone})</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Algorithmic Vetting Score</div>
                    <div className="text-[11px] text-slate-300">Verified against GRA Tax, Registration & ESG Criteria</div>
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono">{activePreviewDoc.data.complianceScore}%</div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white uppercase text-xs">Binding Contract Terms:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li>Partner agrees to adhere strictly to GrowForMe ESG and zero-child-labor policies.</li>
                    <li>Digital traceability waybills must accompany all input vouchers and grain deliveries.</li>
                    <li>Total active contracts value capped at GH₵ {activePreviewDoc.data.totalContractsGHS.toLocaleString()}.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Render 2: Off-Taker Trade Contract Template */}
            {activePreviewDoc.docType === 'TRADE' && (
              <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800 space-y-5 text-slate-200 text-xs">
                <div className="text-center space-y-1 border-b border-slate-800 pb-4">
                  <h3 className="text-lg font-extrabold text-white uppercase">OFF-TAKER TRADE EXCHANGE CONTRACT</h3>
                  <div className="text-xs text-blue-400 font-bold">Contract No: #{activePreviewDoc.data.contractNo}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Off-Taker / Buyer:</span>
                    <strong className="text-white text-sm block">{activePreviewDoc.data.offtakerName}</strong>
                    <span className="text-slate-400 mt-1 block">Type: {activePreviewDoc.data.offtakerType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Contract Type & Deadline:</span>
                    <strong className="text-white text-sm block">{activePreviewDoc.data.contractType}</strong>
                    <span className="text-slate-400 mt-1 block">Deadline: {activePreviewDoc.data.deliveryDeadline}</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Volume</span>
                    <strong className="text-white text-sm font-mono">{activePreviewDoc.data.quantityMT} MT</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Price per MT</span>
                    <strong className="text-white text-sm font-mono">GH₵ {activePreviewDoc.data.pricePerMTGHS.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Contract Value</span>
                    <strong className="text-blue-400 text-sm font-mono font-bold">GH₵ {activePreviewDoc.data.totalValueGHS.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Render 3: EUDR Deforestation Certificate Template */}
            {activePreviewDoc.docType === 'EUDR' && (
              <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800 space-y-5 text-slate-200 text-xs">
                <div className="text-center space-y-1 border-b border-slate-800 pb-4">
                  <h3 className="text-lg font-extrabold text-white uppercase">EUDR DEFORESTATION COMPLIANCE CERTIFICATE</h3>
                  <div className="text-xs text-emerald-400 font-bold">WHR Receipt: {activePreviewDoc.data.warehouseReceiptNo}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Outgrower Farmer:</span>
                    <strong className="text-white text-sm block">{activePreviewDoc.data.farmerName}</strong>
                    <span className="text-slate-400 mt-1 block">Batch: {activePreviewDoc.data.batchNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Commodity Weight:</span>
                    <strong className="text-emerald-400 text-sm block font-mono">{activePreviewDoc.data.actualYieldKg.toLocaleString()} Kg</strong>
                    <span className="text-slate-400 mt-1 block">Grade: {activePreviewDoc.data.qualityGrade}</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>EU Deforestation Regulation (EUDR) Polygon Clearance</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Geospatial WGS84 GIS polygon boundary verified zero deforestation post-2020. Approved for European export.
                  </p>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-mono">Digital Signature: VERIFIED_GFM_SECURE</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-bold bg-slate-800 text-slate-200 rounded-xl hover:bg-slate-700 flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setActivePreviewDoc(null)}
                  className="px-5 py-2 text-xs font-bold bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
