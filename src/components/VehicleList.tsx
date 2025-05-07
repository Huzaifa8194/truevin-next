'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import { VehicleCard } from './VehicleCard';

interface Vehicle {
  stock_number: string;
  one_image?: string;
  allpagedata_images?: string[];
  html_s3_url?: string;
  details?: string;
  allpagedata_fields?: Record<string, any>;
  newdata?: Record<string, string> | Array<Record<string, string>> | string;
  vin_display?: string;
  final_bid?: string;
  timestamp?: string | number;
}

interface VehicleListProps {
  initialVehicles: Vehicle[];
}

export function VehicleList({ initialVehicles }: VehicleListProps) {
  const [list, setList] = useState(initialVehicles);
  const [sortOrder, setSortOrder] = useState('Newest');
  const [itemsToShow, setItemsToShow] = useState(15);

  const passesFlag = (v: any) =>
    v.newdata_passed === true ||
    v.newdata_passed === 'true' ||
    v.allpagedata_passed === true ||
    v.allpagedata_passed === 'true';

  const filtered = useMemo(() => {
    const arr = list.filter(
      v => passesFlag(v) && v.final_bid && !v.final_bid.includes('N/A')
    );

    if (sortOrder === 'Price: Low to High') {
      arr.sort(
        (a, b) =>
          parseFloat((a.final_bid || '0').replace(/[^0-9.]/g, '')) -
          parseFloat((b.final_bid || '0').replace(/[^0-9.]/g, ''))
      );
    } else if (sortOrder === 'Price: High to Low') {
      arr.sort(
        (a, b) =>
          parseFloat((b.final_bid || '0').replace(/[^0-9.]/g, '')) -
          parseFloat((a.final_bid || '0').replace(/[^0-9.]/g, ''))
      );
    } else {
      arr.sort((a, b) => {
        const timestampA = typeof a.timestamp === 'string' ? parseInt(a.timestamp) : a.timestamp ?? 0;
        const timestampB = typeof b.timestamp === 'string' ? parseInt(b.timestamp) : b.timestamp ?? 0;
        return timestampB - timestampA;
      });
    }
    return arr;
  }, [list, sortOrder]);

  const fetchMore = () =>
    setTimeout(() => setItemsToShow(prev => prev + 15), 500);
  const displayed = filtered.slice(0, itemsToShow);

  return (
    <div className="min-h-screen w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-6">
          <select
            className="rounded-lg border-gray-300 shadow-sm py-2 px-3"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
          >
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <InfiniteScroll
          dataLength={displayed.length}
          next={fetchMore}
          hasMore={displayed.length < filtered.length}
          loader={<h4 className="text-center py-4">Loading more...</h4>}
          endMessage={<p className="text-center py-4">All vehicles loaded</p>}
          scrollThreshold={0.8}
        >
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-8 lg:px-12">
            {displayed.map(vehicle => (
              <VehicleCard key={vehicle.stock_number} vehicle={vehicle} />
            ))}
          </motion.div>
        </InfiniteScroll>
      </div>
    </div>
  );
} 