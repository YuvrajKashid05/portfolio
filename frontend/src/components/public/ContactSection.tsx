'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, Loader2, MapPin, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { api, Profile } from '@/lib/api';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().max(150).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(3000),
  website: z.string().max(0).optional(), // Honeypot
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactSectionProps {
  profile?: Profile | null;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
    setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    // Client-side Zod validation
    const result = contactFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await api.submitContact(formData);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '', website: '' });
    } catch (err: any) {
      setServerError(err?.message || 'Failed to submit inquiry. Please try again or reach out directly via email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 max-w-7xl mx-auto px-6 sm:px-8 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500] text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" /> Start A Conversation
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Have an engineering challenge or opportunity?
          </h2>

          <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
            Whether you need a senior full-stack architect to build a greenfield MVP, optimize low-latency database queries, or build fluid React Native apps, let?s talk.
          </p>

          <div className="pt-4 space-y-4 text-sm text-[#A1A1AA]">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#18181b] border border-white/5 flex items-center justify-center text-[#FF5500]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs text-[#A1A1AA]">Direct Email</span>
                <a
                  href="mailto:contact@portfolio.dev"
                  className="text-white font-medium hover:text-[#FF5500] transition-colors"
                >
                  contact@portfolio.dev
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#18181b] border border-white/5 flex items-center justify-center text-[#FF6B35]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs text-[#A1A1AA]">Location & Availability</span>
                <span className="text-white font-medium">Worldwide (Remote) ? Full-Time & Advisory</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-[#18181b] border border-white/10 p-8 shadow-2xl relative overflow-hidden">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#FF5500]/10 to-transparent rounded-bl-full pointer-events-none" />

            {/* Success Message */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6 flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Message Received!</h4>
                  <p className="text-xs text-emerald-300 leading-relaxed">
                    Thank you for reaching out. I have received your message and will respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-3 text-xs font-semibold text-emerald-400 hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {serverError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mb-6 flex items-start gap-3 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot hidden input */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-2">
                    Your Name <span className="text-[#FF5500]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-xl bg-[#111113] border text-white text-sm focus:outline-none transition-colors ${
                      errors.name
                        ? 'border-red-500/80 focus:border-red-500'
                        : 'border-white/10 focus:border-[#FF5500]'
                    }`}
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-2">
                    Email Address <span className="text-[#FF5500]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@company.com"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-xl bg-[#111113] border text-white text-sm focus:outline-none transition-colors ${
                      errors.email
                        ? 'border-red-500/80 focus:border-red-500'
                        : 'border-white/10 focus:border-[#FF5500]'
                    }`}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-2">
                  Subject / Project Scope
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Next.js SaaS Platform Architecture"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl bg-[#111113] border border-white/10 focus:border-[#FF5500] text-white text-sm focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-2">
                  Project Details / Message <span className="text-[#FF5500]">*</span>
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your tech stack, requirements, timelines, or role..."
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl bg-[#111113] border text-white text-sm focus:outline-none transition-colors resize-none ${
                    errors.message
                      ? 'border-red-500/80 focus:border-red-500'
                      : 'border-white/10 focus:border-[#FF5500]'
                  }`}
                />
                {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#FF5500] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#A32A17] shadow-lg shadow-[#FF5500]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-[#FF5500]/40"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Transmitting Message...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
