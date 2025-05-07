import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import the contact form component with client-side rendering
const ContactForm = dynamic(() => import('@/components/ContactForm'), { ssr: false });

export const metadata: Metadata = {
  title: 'Contact Us - TrueVin',
  description: 'Contact TrueVin for vehicle information and support',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ContactForm />
        </div>
      </main>
    </div>
  );
}