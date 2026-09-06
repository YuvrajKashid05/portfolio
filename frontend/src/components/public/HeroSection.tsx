'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Terminal, Sparkles, Layers, Cpu } from 'lucide-react';
import SunsetConstellation from '../canvas/SunsetConstellation';
import { Profile } from '@/lib/api';

interface HeroSectionProps {
  profile?: Profile | null;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const name = profile?.name || 'Senior Full-Stack Engineer';
  const title = profile?.title || 'Full-Stack Web, Mobile & AI Solutions Architect';
  const bio =
    profile?.bio ||
    'Architecting resilient distributed web systems, fluid React Native mobile apps, and low-latency Node/Python AI microservices.';

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* 3D Interactive Three.js Constellation */}
      <SunsetConstellation />

      {/* Ambient Sunset Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#FF6B35]/15 via-[#A32A17]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#18181b]/80 border border-white/10 backdrop-blur-md mb-8 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-[18px]" />
          <span className="text-xs font-medium text-[#A1A1AA] tracking-wide">
            Available for Architecture & Engineering Projects
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
        >
          Building scalable{' '}
          <span className="bg-gradient-to-r from-[#FF5500] via-[#FF6B35] to-[#A32A17] bg-clip-text text-transparent">
            web, mobile & AI
          </span>{' '}
          systems.
        </motion.h1>

        {/* Bio / Description */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="text-lg sm:text-xl text-[#A1A1AA] max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
        >
          {bio}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <Link
            href="#projects"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#FF5500] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#A32A17] shadow-lg shadow-[#FF5500]/30 hover:shadow-[#FF5500]/50 transition-all duration-300 hover:scale-[1.02]"
          >
            Explore Projects <ArrowDown className="w-4 h-4 animate-bounce" />
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-[#18181b] border border-white/10 hover:border-[#FF5500]/50 hover:bg-[#232328] transition-all duration-300"
          >
            Get In Touch <ArrowUpRight className="w-4 h-4 text-[#A1A1AA]" />
          </Link>
        </motion.div>

        {/* Technical Domain Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-white/10"
        >
          <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <Layers className="w-5 h-5 text-[#FF5500] mb-2" />
            <span className="text-xs font-semibold text-white">Full-Stack Web</span>
            <span className="text-[11px] text-[#A1A1AA]">Next.js ? React ? TS</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <Terminal className="w-5 h-5 text-[#FF6B35] mb-2" />
            <span className="text-xs font-semibold text-white">Mobile Apps</span>
            <span className="text-[11px] text-[#A1A1AA]">React Native ? Expo</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <Cpu className="w-5 h-5 text-[#FF5500] mb-2" />
            <span className="text-xs font-semibold text-white">Distributed APIs</span>
            <span className="text-[11px] text-[#A1A1AA]">Node ? Express ? Prisma</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <Sparkles className="w-5 h-5 text-[#A32A17] mb-2" />
            <span className="text-xs font-semibold text-white">AI Services</span>
            <span className="text-[11px] text-[#A1A1AA]">Python ? FastAPI ? LLMs</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
