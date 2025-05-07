'use client';

import { useState, useEffect } from 'react';
import { Camera, Info } from 'lucide-react';
import { Custom360Spin } from './Custom360Spin';

interface Vehicle360ViewerProps {
  images: string[];
  mainImage: string;
}

export function Vehicle360Viewer({ images, mainImage }: Vehicle360ViewerProps) {
  const [show360, setShow360] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  // Hide the info tooltip after 5 seconds
  useEffect(() => {
    if (showInfo) {
      const timer = setTimeout(() => {
        setShowInfo(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showInfo]);

  const handle360Click = () => {
    setShow360(true);
    setShowInfo(false);
  };

  return (
    <div className="relative h-12">
      {images.length > 0 && (
        <>
          <button
            onClick={handle360Click}
            className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg z-10 transition-all"
            aria-label="View 360 images"
          >
            <Camera size={18} />
            <span>360 degree</span>
          </button>
          
          {showInfo && images.length >= 10 && (
            <div className="absolute bottom-16 right-4 bg-black/70 text-white text-xs p-2 rounded max-w-[200px] animate-pulse">
              Click to view the vehicle in 360° rotation
            </div>
          )}
        </>
      )}
      {show360 && images.length > 0 && (
        <Custom360Spin
          images={images}
          onClose={() => setShow360(false)}
        />
      )}
    </div>
  );
} 