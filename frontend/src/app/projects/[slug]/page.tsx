'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink, Github, Calendar, Layers, ShieldCheck, Cpu } from 'lucide-react';
import { api, Project } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => api.getProject(slug),
    enabled: Boolean(slug),
    retry: 1,
  });

  const project: Project | undefined = data?.project;

  if (isLoading) {
    return (
      <div className="pt-36 pb-24 max-w-4xl mx-auto px-6 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-white/5 rounded" />
        <div className="h-12 w-3/4 bg-white/5 rounded" />
        <div className="h-72 w-full bg-white/5 rounded-2xl" />
        <div className="h-4 w-full bg-white/5 rounded" />
        <div className="h-4 w-5/6 bg-white/5 rounded" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="pt-36 pb-24 max-w-xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Case Study Not Found</h2>
        <p className="text-sm text-[#A1A1AA] mb-6">
          The requested project could not be found or may have been updated.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5500] text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Archives
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 sm:px-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#A1A1AA] hover:text-[#FF5500] transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          {project.featured && (
            <span className="px-3 py-1 rounded-full bg-[#FF5500]/20 border border-[#FF5500]/30 text-xs font-bold text-[#FF5500]">
              Featured Project
            </span>
          )}
          <span className="text-xs text-[#A1A1AA] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Published {formatDate(project.createdAt)}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
          {project.tagline}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#FF5500] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#A32A17] shadow-lg shadow-[#FF5500]/30 transition-all hover:scale-[1.02]"
            >
              Launch Live Application <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs text-white bg-[#18181b] border border-white/10 hover:border-[#FF5500]/50 hover:bg-[#232328] transition-all"
            >
              Inspect Source Code <Github className="w-4 h-4 text-[#A1A1AA]" />
            </a>
          )}
        </div>
      </div>

      {/* Hero Media Cover */}
      <div className="relative h-80 sm:h-[420px] w-full rounded-2xl overflow-hidden bg-black/40 border border-white/10 mb-12 shadow-2xl">
        <Image
          src={project.thumbnailUrl}
          alt={project.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 800px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111113]/80 via-transparent to-transparent" />
      </div>

      {/* Tech Stack Matrix */}
      <div className="p-6 rounded-2xl bg-[#18181b] border border-white/10 mb-12">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF5500] mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4" /> Architecture & Technologies Used
        </h3>
        <div className="flex flex-wrap gap-2">
          {project.skills.map((skill) => (
            <div
              key={skill.id}
              className="px-3.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 flex items-center gap-2 text-xs font-medium text-white"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
              {skill.name}
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Technical Description */}
      <div className="space-y-6 text-sm sm:text-base text-[#A1A1AA] leading-relaxed border-t border-white/10 pt-8">
        <h3 className="text-xl font-bold text-white tracking-tight">System Architecture & Highlights</h3>
        <div className="space-y-4 whitespace-pre-line">
          {project.description}
        </div>
      </div>
    </div>
  );
}
