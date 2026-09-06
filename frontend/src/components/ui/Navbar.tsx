'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield, ArrowUpRight, Code2 } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Work', href: '/#projects' },
    { label: 'Skills', href: '/#skills' },
    { label: 'All Projects', href: '/projects' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#111113]/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#A32A17] p-[1px] shadow-sm shadow-[#FF5500]/30 transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-[#111113] rounded-[7px] flex items-center justify-center text-[#FF5500]">
              <Code2 className="w-5 h-5" />
            </div>
          </div>
          <span className="font-bold text-lg tracking-tight text-white group-hover:text-[#FF5500] transition-colors">
            DevPortfolio<span className="text-[#FF5500]">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action Button & Admin */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 text-[#A1A1AA] hover:text-white transition-colors rounded-lg hover:bg-white/5"
            title="CMS Dashboard"
          >
            <Shield className="w-4 h-4" />
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#FF5500] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#A32A17] shadow-md shadow-[#FF5500]/25 transition-all hover:shadow-[#FF5500]/40 hover:scale-[1.02]"
          >
            Hire Me <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#A1A1AA] hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#18181b]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-white hover:text-[#FF5500]"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-[#A1A1AA] flex items-center gap-2"
            >
              <Shield className="w-4 h-4" /> CMS Admin
            </Link>
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#FF5500]"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
