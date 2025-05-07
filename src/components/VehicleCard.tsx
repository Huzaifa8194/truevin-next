import Link from 'next/link';
import { motion } from 'framer-motion';
import { VinDisplay } from './VinDisplay';
import "@/styles/style1.css";


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

interface VehicleCardProps {
  vehicle: Vehicle;
}

const safeDisplay = (val: any) =>
  val !== undefined && val !== null && val !== '' ? val : 'Not available';

export function VehicleCard({ vehicle: v }: VehicleCardProps) {
  const fields: Record<string, any> = {};
  if (v.allpagedata_fields && Object.keys(v.allpagedata_fields).length) {
    Object.assign(fields, v.allpagedata_fields);
  }
  if (v.details) {
    const copy = (obj: Record<string, string>) => {
      const k = Object.keys(obj)[0];
      if (fields[k] === undefined || fields[k] === '')
        fields[k] = obj[k];
    };

    if (typeof v.details === 'string') {
      try {
        JSON.parse(v.details).forEach(copy);
      } catch {}
    } else if (Array.isArray(v.details)) {
      (v.details as Array<Record<string, string>>).forEach(copy);
    } else if (typeof v.details === 'object') {
      Object.entries(v.details).forEach(([k, val]) => {
        if (fields[k] === undefined || fields[k] === '')
          fields[k] = val;
      });
    }
  }

  const year = fields.Year;
  const make = fields.Make;
  const model = fields.Model;
  const title =
    fields.VehicleTitle ||
    (year && make && model
      ? `${year} ${make} ${model}`
      : v.stock_number);

  const img =
    v.allpagedata_images?.[0] ||
    v.one_image ||
    v.html_s3_url ||
    '';

  return (
    <motion.div
      key={v.stock_number}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-transform"
      whileHover={{ scale: 1.02 }}
    >
      <Link href={`/vehicle/${v.stock_number}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={img}
            alt="Vehicle"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
            {safeDisplay(title)}
          </h3>
          <p className="text-gray-600">
            Stock #{v.stock_number}
          </p>
          <VinDisplay vin={v.vin_display || ''} />
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-emerald-600">
              ${safeDisplay(v.final_bid)}
            </span>
            <button className="btn-secondary py-1 px-3 text-sm">
              View
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 