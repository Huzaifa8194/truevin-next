import React from 'react';
import { Navbar } from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

interface AboutUsPageProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AboutUsPage({ isMenuOpen, setIsMenuOpen }: AboutUsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 mb-6">
                Welcome to our vehicle marketplace, where we connect buyers with quality vehicles. 
                Our platform is dedicated to providing a seamless and transparent experience for 
                all automotive enthusiasts.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                We strive to revolutionize the way people buy and sell vehicles by providing 
                a trusted platform that prioritizes transparency, quality, and customer satisfaction.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What We Offer</h2>
              <ul className="list-disc pl-6 text-lg text-gray-700 mb-6">
                <li className="mb-2">Comprehensive vehicle listings with detailed information</li>
                <li className="mb-2">Transparent pricing and vehicle history</li>
                <li className="mb-2">Advanced search and filtering capabilities</li>
                <li className="mb-2">Secure and reliable transaction process</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparency</h3>
                  <p className="text-gray-700">Clear and honest information about every vehicle</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality</h3>
                  <p className="text-gray-700">Rigorous standards for all listed vehicles</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Focus</h3>
                  <p className="text-gray-700">Dedicated to providing exceptional service</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 