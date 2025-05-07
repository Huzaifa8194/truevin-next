'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Rotate3D, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Custom360SpinProps {
  images: string[];
  onClose: () => void;
}

export function Custom360Spin({ images, onClose }: Custom360SpinProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragSensitivity, setDragSensitivity] = useState(1);
  const [autoRotate, setAutoRotate] = useState(false);
  const [dragDirection, setDragDirection] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const dragSpeedRef = useRef(0);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Previous and next image functions
  const prevImage = () => setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  const nextImage = () => setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));

  // Move image with momentum
  const animate = (time: number) => {
    if (previousTimeRef.current === null) {
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    const deltaTime = time - previousTimeRef.current;
    
    if (Math.abs(dragSpeedRef.current) > 0.1) {
      // Apply friction to slow down
      dragSpeedRef.current *= 0.95;
      
      if (deltaTime > 50) { // Limit the update rate
        if (dragSpeedRef.current > 0) {
          prevImage();
        } else if (dragSpeedRef.current < 0) {
          nextImage();
        }
        previousTimeRef.current = time;
      }
      
      requestRef.current = requestAnimationFrame(animate);
    } else {
      // Stop animation when speed is too low
      previousTimeRef.current = null;
      dragSpeedRef.current = 0;
    }
  };
  
  // Start momentum scrolling after drag ends
  const startMomentum = () => {
    if (dragDirection !== 0) {
      dragSpeedRef.current = dragDirection * 2; // Initial speed based on drag direction
      if (requestRef.current === null) {
        requestRef.current = requestAnimationFrame(animate);
      }
    }
  };

  // Toggle auto-rotation
  const toggleAutoRotate = () => {
    setAutoRotate(prev => !prev);
  };

  useEffect(() => {
    // Auto rotation
    if (autoRotate) {
      intervalRef.current = setInterval(() => {
        nextImage();
      }, 150);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
    };
  }, [autoRotate, images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === ' ') {
        toggleAutoRotate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, onClose]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setDragDirection(0);
    
    // Stop auto-rotation and animation when user starts dragging
    setAutoRotate(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const moveThreshold = 20 / dragSensitivity; // Dynamic threshold based on sensitivity
    
    if (Math.abs(deltaX) > moveThreshold) {
      const direction = deltaX > 0 ? 1 : -1;
      setDragDirection(direction);
      
      if (direction > 0) {
        prevImage();
      } else {
        nextImage();
      }
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      startMomentum();
      setIsDragging(false);
    }
  };

  // Touch event handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setDragDirection(0);
    
    // Stop auto-rotation when user touches
    setAutoRotate(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - startX;
    const moveThreshold = 15 / dragSensitivity; // More sensitive for touch
    
    if (Math.abs(deltaX) > moveThreshold) {
      const direction = deltaX > 0 ? 1 : -1;
      setDragDirection(direction);
      
      if (direction > 0) {
        prevImage();
      } else {
        nextImage();
      }
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      startMomentum();
      setIsDragging(false);
    }
  };

  // Preload images
  useEffect(() => {
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchEnd={handleTouchEnd}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-20"
          aria-label="Close 360 view"
        >
          <X size={24} />
        </button>

        {/* Auto-rotate toggle button */}
        <button
          onClick={toggleAutoRotate}
          className="absolute top-4 left-4 text-white hover:text-gray-300 p-2 z-20 bg-black/30 rounded-full"
          aria-label={autoRotate ? "Stop rotation" : "Start auto-rotation"}
        >
          {autoRotate ? <Pause size={24} /> : <Rotate3D size={24} />}
        </button>

        {/* Sensitivity controls */}
        <div className="absolute top-16 left-4 z-20 bg-black/30 rounded p-2 flex flex-col items-center">
          <span className="text-white text-xs mb-1">Sensitivity</span>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={dragSensitivity}
            onChange={(e) => setDragSensitivity(parseFloat(e.target.value))}
            className="w-24"
          />
        </div>

        {/* Navigation buttons for mobile */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10 md:hidden"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10 md:hidden"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>

        <div
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`360 view ${currentIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
          
          {/* Drag instruction */}
          {!isDragging && !autoRotate && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white bg-black/40 px-4 py-2 rounded-lg text-sm animate-pulse">
              Drag to rotate or press space to auto-rotate
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
