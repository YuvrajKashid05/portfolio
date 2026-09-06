'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight, Star } from 'lucide-react';
import { Project } from '@/lib/api';

interface FeaturedProjectsProps {
  projects: Project[];
  isLoading?: boolean;
}

export default function FeaturedProjects({ projects, isLoading }: FeaturedProjectsProps) {
  return (
    <section id="projects" className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500] text-xs font-semibold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5" /> Featured Work
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Selected Engineering Projects
          </h2>
        </div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF5500] hover:text-[#FF6B35] group transition-colors"
        >
          View all archives
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-2xl bg-[#18181b] border border-white/5 p-6 animate-pulse space-y-4"
            >
              <div className="h-48 bg-white/5 rounded-xl" />
              <div className="h-6 w-3/4 bg-white/5 rounded" />
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-1/2 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && projects.length === 0 && (
        <div className="text-center py-16 bg-[#18181b] rounded-2xl border border-white/5">
          <p className="text-[#A1A1AA] text-base">No featured projects found.</p>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="group relative flex flex-col justify-between rounded-2xl bg-[#18181b] border border-white/10 hover:border-[#FF5500]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#FF5500]/10 overflow-hidden"
          >
            {/* Project Image & Overlay */}
            <div className="relative h-52 w-full overflow-hidden bg-black/40">
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-[#18181b]/20 to-transparent" />

              {/* Featured Pill */}
              {project.featured && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#FF5500]/90 backdrop-blur-md text-[11px] font-bold text-white uppercase tracking-wider shadow-sm">
                  Featured
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <Link href={`/projects/${project.slug}`}>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#FF5500] transition-colors line-clamp-1 mb-2">
                    {project.title}
                  </h3>
                </Link>
                <p className="text-xs font-medium text-[#A1A1AA] line-clamp-2 mb-4 leading-relaxed">
                  {project.tagline}
                </p>

                {/* Tech Skills Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.skills.slice(0, 5).map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[11px] font-medium text-[#A1A1AA]"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {project.skills.length > 5 && (
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.02] text-[10px] text-[#A1A1AA]">
                      +{project.skills.length - 5}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-medium">
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-white hover:text-[#FF5500] flex items-center gap-1 transition-colors"
                >
                  Case Study <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-3 text-[#A1A1AA]">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                      title="Source Code"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#FF5500] transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
