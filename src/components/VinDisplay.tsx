'use client';

import { useState, useEffect } from 'react';

interface VinDisplayProps {
  html: string;
  className?: string;
}

export function VinDisplay({ html, className = '' }: VinDisplayProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

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