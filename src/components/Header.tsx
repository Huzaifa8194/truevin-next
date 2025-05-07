'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Car, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Mobile Toggle */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="flex items-center space-x-3 ml-2 md:ml-0">
              <motion.div
                className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <Car className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                TrueVin
              </span>
            </Link>
          </div>

          {/* Desktop Links + Search */}
          <div className="hidden md:flex md:items-center md:space-x-10">
            <Link
              href="/"
              className="text-gray-700 hover:text-indigo-600 text-lg font-medium transition-colors duration-200"
            >
              Home
            </Link>
           
            <Link
              href="/about"
              className="text-gray-700 hover:text-indigo-600 text-lg font-medium transition-colors duration-200"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-indigo-600 text-lg font-medium transition-colors duration-200"
            >
              Contact Us
            </Link>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search vehicles..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:outline-none w-64"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-2 bg-white shadow-lg rounded-lg py-4 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/"
              className="block px-6 py-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/vehicles"
              className="block px-6 py-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Vehicles
            </Link>
            <Link
              href="/about"
              className="block px-6 py-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact" 
              className="block px-6 py-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            <div className="px-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header; 