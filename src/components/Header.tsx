'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://api.dicebear.com/7.x/initials/svg?seed=TrueVin&backgroundColor=4f46e5"
              alt="TrueVin Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              TrueVin
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link href="/vehicles" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Vehicles
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 hover:text-indigo-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link
              href="/"
              className="block text-gray-600 hover:text-indigo-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/vehicles"
              className="block text-gray-600 hover:text-indigo-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Vehicles
            </Link>
            <Link
              href="/about"
              className="block text-gray-600 hover:text-indigo-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-gray-600 hover:text-indigo-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header; 