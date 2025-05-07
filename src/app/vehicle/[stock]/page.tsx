'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DynamicMeta } from '@/components/DynamicMeta';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Vehicle360Viewer } from '@/components/Vehicle360Viewer';
import { VinDisplay } from '@/components/VinDisplay';

interface Vehicle {
  stock_number: string;
  one_image?: string;
  allpagedata_images?: string[];
  allpagedata_3sixty?: string[];
  html_s3_url?: string;
  details?: string;
  allpagedata_fields?: Record<string, any>;
  newdata?: Record<string, string> | Array<Record<string, string>> | string;
  vin_display?: string;
  ocr_result?: string;
  final_bid?: string;
  timestamp?: string;
  unprocessed_vin?: string;
  veh_video_link?: string;
  sr_key?: number;
}

const API_BASE = 'https://p42429x0l5.execute-api.eu-north-1.amazonaws.com/prod';

async function fetchVehicleBySrKey(sr_key: number): Promise<Vehicle | null> {
  let currentKey = sr_key;
  const direction = sr_key >= 0 ? 1 : -1;
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    try {
      const res = await fetch(`${API_BASE}/sr/${currentKey}`, {
        headers: { 'x-api-key': process.env.API_KEY || '' },
        next: { revalidate: 3600 },
      });
      if (!res.ok) throw new Error('Failed to fetch vehicle');
      const items: Vehicle[] = await res.json();
      if (items && items.length > 0 && items[0]) {
        return items[0];
      }
      // If no vehicle found, try the next key
      currentKey += direction;
      attempts++;
    } catch (err) {
      console.error(err);
      currentKey += direction;
      attempts++;
    }
  }
  return null;
}

export default function VehicleDetailPage({ params }: { params: { stock: string } }) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadVehicle = async (stock: string) => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/stocks/${encodeURIComponent(stock)}`, {
      headers: { 'x-api-key': process.env.API_KEY || '' },
      next: { revalidate: 3600 },
    });
    const items: Vehicle[] = await res.json();
    setVehicle(items[0] ?? null);
    setLoading(false);
  };

  useEffect(() => {
    loadVehicle(params.stock);
  }, [params.stock]);

  if (loading || !vehicle) return <div className="p-8">Loading vehicle...</div>;

  const safe = (v: any) =>
    v !== undefined && v !== null && v !== '' ? v : 'Not available';

  const images = vehicle.allpagedata_images?.length
    ? vehicle.allpagedata_images
    : vehicle.one_image
    ? [vehicle.one_image]
    : vehicle.html_s3_url
    ? [vehicle.html_s3_url]
    : [];

  const spinImages = vehicle.allpagedata_3sixty || [];

  const oldFields: Record<string, string> = {};
  if (vehicle.allpagedata_fields && Object.keys(vehicle.allpagedata_fields).length) {
    Object.assign(oldFields, vehicle.allpagedata_fields);
  } else if (vehicle.details) {
    try {
      (JSON.parse(vehicle.details) as Array<Record<string, string>>).forEach(o => {
        const k = Object.keys(o)[0];
        oldFields[k] = o[k];
      });
    } catch {}
  }

  const newFields: Record<string, string> = {};
  if (vehicle.newdata) {
    if (Array.isArray(vehicle.newdata)) {
      vehicle.newdata.forEach(o => Object.assign(newFields, o));
    } else if (typeof vehicle.newdata === 'string') {
      try {
        Object.assign(newFields, JSON.parse(vehicle.newdata));
      } catch {}
    } else if (typeof vehicle.newdata === 'object') {
      Object.assign(newFields, vehicle.newdata);
    }
  }

  const merged: Record<string, string> = { ...oldFields };
  Object.entries(newFields).forEach(([k, v]) => {
    const current = merged[k];
    if (current === undefined) {
      merged[k] = v;
    } else {
      const currentMasked = String(current).includes('*');
      const newMasked = String(v).includes('*');
      if (currentMasked && !newMasked) merged[k] = v;
    }
  });

  delete merged.VIN;
  delete merged['VIN Status'];
  delete merged.VIN_Status_;

  if (vehicle.unprocessed_vin) {
    const prefix = vehicle.unprocessed_vin;
    const suffix = vehicle.ocr_result ? vehicle.ocr_result.slice(-6) : '';
    merged['VIN'] = `${prefix}${suffix}`;
  }

  let title = merged.VehicleTitle;
  if (!title && merged.Year && merged.Make && merged.Model) {
    title = `${merged.Year} ${merged.Make} ${merged.Model}`;
  }
  if (!title) title = vehicle.stock_number;

  const vinFirst11 = vehicle.unprocessed_vin || '';
  const vinLast6 = vehicle.ocr_result ? vehicle.ocr_result.slice(-6) : '';

  const handleNextPrev = async (offset: number) => {
    const sr_key = vehicle.sr_key ?? 0;
    const nextKey = sr_key + offset;
    const nextVehicle = await fetchVehicleBySrKey(nextKey);
    if (nextVehicle?.stock_number) {
      router.push(`/vehicle/${nextVehicle.stock_number}`);
    } else {
      alert(`No more vehicles found in this direction.`);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-gray-100 flex flex-col">
      <DynamicMeta
        vehicle={{ ...vehicle, allpagedata_fields: { ...merged, VehicleTitle: title } }}
      />

      <div className="flex-grow max-w-5xl mx-auto p-4 space-y-8 w-full">
        <div>
          <Link href="/" className="flex items-center text-gray-700 hover:text-gray-900">
            <ArrowLeft className="mr-2" /> Back to listings
          </Link>
          <h1 className="text-3xl font-bold mt-2">{title}</h1>
          <div className="text-sm text-gray-600">
            #{vehicle.stock_number} &nbsp;|&nbsp; VIN: {vinFirst11}{vinLast6}
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => handleNextPrev(-1)}
          >
            ← Previous Vehicle
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => handleNextPrev(1)}
          >
            Next Vehicle →
          </button>
        </div>

        <div className="bg-white shadow rounded overflow-hidden">
          <Vehicle360Viewer mainImage={images[0]} images={spinImages} />
          <div className="flex space-x-2 overflow-x-auto p-2 bg-gray-50">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`thumb-${i}`}
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>
        </div>

        {vehicle.veh_video_link && (
          <div className="bg-white shadow rounded overflow-hidden">
            <video className="w-full h-auto" controls src={vehicle.veh_video_link} />
          </div>
        )}

        <div className="flex justify-between bg-white shadow rounded p-4">
          <div>
            <div className="text-sm text-gray-500">Final Bid</div>
            <div className="text-2xl font-bold text-green-600">
              {safe(vehicle.final_bid)}
            </div>
          </div>
          <VinDisplay vin={vehicle.unprocessed_vin || ''} className="prose text-gray-700" />
        </div>

        {Object.keys(merged).length > 0 && (
          <div className="bg-white shadow rounded p-6">
            <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(merged).map(([k, v]) => (
                <div key={k} className="border rounded p-3">
                  <div className="text-xs text-gray-500 mb-1">
                    {k.replace(/_/g, ' ')}
                  </div>
                  <div className="font-medium">{safe(v)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
