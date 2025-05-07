import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import the about page component with client-side rendering
const AboutContent = dynamic(() => import('@/components/AboutContent'), { ssr: false });

export const metadata: Metadata = {
  title: 'About Us - TrueVin',
  description: 'Learn about TrueVin and our vehicle information services',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AboutContent />
        </div>
      </main>
    </div>
  );
} 