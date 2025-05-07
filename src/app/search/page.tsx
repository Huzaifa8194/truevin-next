import { notFound } from 'next/navigation';
import { VehicleList } from '@/components/VehicleList';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoogleAd from '@/components/GoogleAd';

const API_BASE = 'https://p42429x0l5.execute-api.eu-north-1.amazonaws.com/prod';

async function searchVehicles(searchParams: { [key: string]: string | string[] | undefined }) {
  try {
    let url = '';
    if (searchParams.vin) {
      url = `${API_BASE}/stocks/ocr?vin=${encodeURIComponent(searchParams.vin as string)}`;
    } else if (searchParams.make && searchParams.model && searchParams.year) {
      url = `${API_BASE}/stocks/search?make=${encodeURIComponent(searchParams.make as string)}&model=${encodeURIComponent(searchParams.model as string)}&year=${encodeURIComponent(searchParams.year as string)}`;
    } else {
      return [];
    }

    const res = await fetch(url, {
      headers: { 'x-api-key': process.env.API_KEY || '' },
      next: { revalidate: 3600 } // Revalidate every hour
    });
    if (!res.ok) throw new Error('Failed to fetch search results');
    return await res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const vehicles = await searchVehicles(searchParams);

  if (vehicles.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-100">
      <Navbar />

      <div className="w-full">
        <h1 className="text-3xl font-bold mb-8 px-6">Search Results</h1>
        <div className="px-6">
          <GoogleAd slot="2521397147" />
        </div>
      </div>

      <VehicleList initialVehicles={vehicles} />

     
    </div>
  );
} 