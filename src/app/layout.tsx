import "./globals.css";
import type { Metadata } from "next";
import { AppStateProvider } from "@/context/AppStateContext";

export const metadata: Metadata = {
  title: "GrowForMe | Agri Finance Management System",
  description: "Enterprise-grade agricultural financing, outgrower aggregation, and supply chain ERP tailored for African agribusiness ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#0F172A] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500 selection:text-slate-900">
        <AppStateProvider>
          {children}
        </AppStateProvider>
      </body>
    </html>
  );
}
