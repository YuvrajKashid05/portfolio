'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ContactSection from '@/components/public/ContactSection';

export default function ContactPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>
      <ContactSection />
    </div>
  );
}
