'use client';

import { useState, useEffect } from 'react';

interface VinDisplayProps {
  vin: string;
  className?: string;
}

export function VinDisplay({ vin, className = '' }: VinDisplayProps) {
  const [ready, setReady] = useState(false);
  const [html, setHtml] = useState('');

  useEffect(() => {
    setReady(true);
    // You might want to fetch VIN data here or process the VIN
    // For now, just displaying the VIN directly
    setHtml(`<span>VIN: ${vin}</span>`);
  }, [vin]);

  if (!ready) {
    return <div className={`${className} animate-pulse bg-gray-200 h-8 rounded`} />;
  }

  return (
    <div
      className={`text-gray-600 break-words text-sm ${className}`}
      dangerouslySetInnerHTML={{ __html: html || '<em>No VIN info</em>' }}
    />
  );
} 