'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { DynamicMeta } from '@/components/DynamicMeta';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Vehicle360Viewer } from '@/components/Vehicle360Viewer';
import { VinDisplay } from '@/components/VinDisplay';

import "@/styles/style1.css"; 


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
  timestamp?: string | number;
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const formatTimestamp = (timestamp: string | number | undefined): string => {
    if (!timestamp) return 'Not available';
    
    let date;
    if (typeof timestamp === 'number') {
      // Handle Unix timestamp (in seconds or milliseconds)
      date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp);
    } else {
      // Handle ISO string format
      date = new Date(timestamp);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid date';
    
    // Format date: "Month DD, YYYY at HH:MM AM/PM"
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const handleImageScroll = (direction: number) => {
    const container = document.getElementById('image-carousel');
    if (container) {
      container.scrollBy({ left: direction * 200, behavior: 'smooth' });
    }
  };
  
  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
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
          {images.length > 0 && (
            <div className="relative aspect-video">
              <img
                src={images[currentImageIndex]}
                alt={`Vehicle main view`}
                className="w-full h-full object-cover"
              />
              
              {/* Image navigation arrows for main image */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  
                  <button
                    onClick={() => setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
              
              {/* Position the 360 viewer button inside the main image area */}
              {spinImages.length > 0 && (
                <Vehicle360Viewer mainImage={images[currentImageIndex] || images[0]} images={spinImages} />
              )}
            </div>
          )}
          
          {/* Thumbnail carousel with navigation buttons */}
          {images.length > 1 && (
            <div className="relative bg-gray-50 py-3">
              <button
                onClick={() => handleImageScroll(-1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-1 rounded-full z-10"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div 
                id="image-carousel"
                className="flex space-x-2 overflow-x-auto px-8 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              >
                {images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`thumb-${i}`}
                    className={`w-24 h-24 object-cover rounded cursor-pointer transition-all ${
                      currentImageIndex === i ? 'ring-2 ring-blue-500 scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => selectImage(i)}
                  />
                ))}
              </div>
              
              <button
                onClick={() => handleImageScroll(1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-1 rounded-full z-10"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
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
            {vehicle.timestamp && (
              <div className="text-xs text-gray-500 mt-1">
                Last Updated: {formatTimestamp(vehicle.timestamp)}
              </div>
            )}
          </div>
          <VinDisplay vin={vehicle.vin_display || ''} className="prose text-gray-700" />
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
