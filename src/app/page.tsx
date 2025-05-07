// src/app/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoogleAd from '@/components/GoogleAd';
import { VehicleList } from '@/components/VehicleList';
import { SearchBar } from '@/components/SearchBar';

const API_BASE = 'https://p42429x0l5.execute-api.eu-north-1.amazonaws.com/';

async function getVehicles() {
  try {
    const res = await fetch(`${API_BASE}/vehicles`, {
      headers: { 'x-api-key': process.env.API_KEY || '' },
      next: { revalidate: 3600 } // Revalidate every hour
    });
    if (!res.ok) throw new Error('Failed to fetch vehicles');
    return await res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function HomePage() {
  const vehicles = await getVehicles();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-100">
      {/* ------------------ HERO + SEARCH ------------------ */}
      <section
        className="relative py-20 bg-cover bg-center w-full"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&q=80)',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        <div className="relative w-full px-6 space-y-6">
          <h1 className="text-5xl font-bold text-white text-center">
            Search Vehicles
          </h1>

          <SearchBar />
        </div>
      </section>

      {/* ------------------ ADS / SORT / LIST ------------------ */}
      <div className="w-full px-6">
        <GoogleAd slot="2521397147" />
      </div>

      <Suspense fallback={<div>Loading vehicles...</div>}>
        <VehicleList initialVehicles={vehicles} />
      </Suspense>
    </div>
  );
}
