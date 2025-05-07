'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { VinDisplay } from '@/components/VinDisplay';

interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: string;
  color: string;
  timestamp: string;
  imageUrl: string;
  isNew: boolean;
  isHot: boolean;
  isSold: boolean;
}

export default function VehicleDetailPage() {
  const params = useParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`/api/vehicles/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch vehicle');
        const data = await response.json();
        setVehicle(data);
      } catch (error) {
        console.error('Error fetching vehicle:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Vehicle Not Found</h1>
          <p className="text-gray-600">The vehicle you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative h-96">
            <img
              src={vehicle.imageUrl}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
            {vehicle.isNew && (
              <span className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                New
              </span>
            )}
            {vehicle.isHot && (
              <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Hot
              </span>
            )}
            {vehicle.isSold && (
              <span className="absolute top-4 left-4 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Sold
              </span>
            )}
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Make:</span>
                    <span className="font-medium">{vehicle.make}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model:</span>
                    <span className="font-medium">{vehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year:</span>
                    <span className="font-medium">{vehicle.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color:</span>
                    <span className="font-medium">{vehicle.color}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">VIN Information</h2>
                <VinDisplay vin={vehicle.vin} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 