'use client';

import { VehicleList } from '@/components/VehicleList';

export default function VehiclesPage() {
  return (
    <div className="min-h-screen w-full">
      <h1 className="text-3xl font-bold mb-8 px-6">Available Vehicles</h1>
      <VehicleList initialVehicles={[]} />
    </div>
  );
} 