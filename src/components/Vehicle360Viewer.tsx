'use client';

import { useState } from 'react';
import { Camera } from 'lucide-react';
import { Custom360Spin } from './Custom360Spin';

interface Vehicle360ViewerProps {
  images: string[];
  mainImage: string;
}

export function Vehicle360Viewer({ images, mainImage }: Vehicle360ViewerProps) {
  const [show360, setShow360] = useState(false);

  return (
    <div className="relative aspect-video">
      <img
        src={mainImage}
        alt="Vehicle"
        className="w-full h-full object-cover"
      />
      {images.length > 0 && (
        <button
          onClick={() => setShow360(true)}
          className="absolute bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded flex items-center space-x-2"
        >
          <Camera /> <span>360°</span>
        </button>
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