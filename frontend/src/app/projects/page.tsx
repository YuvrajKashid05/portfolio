'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Github, ExternalLink, ArrowLeft, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api, Project } from '@/lib/api';

export default function ProjectsArchivePage() {
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: () => api.getProjects(),
    retry: 1,
  });

  const projects: Project[] = data?.projects || [];

  // Extract all unique skill tags across projects
  const allSkills = [
    'ALL',
    ...Array.from(
      new Set(
        projects.flatMap((p) => p.skills.map((s) => s.name))
      )
    ),
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.tagline.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase());

    const matchesSkill =
      selectedSkill === 'ALL' ||
      project.skills.some((s) => s.name.toLowerCase() === selectedSkill.toLowerCase());

    return matchesSearch && matchesSkill;
  });

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 sm:px-8">
      {/* Header */}
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A1A1AA] hover:text-[#FF5500] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Homepage
        </Link>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          All Project Archives
        </h1>
        <p className="text-[#A1A1AA] max-w-2xl text-sm sm:text-base">
          A comprehensive catalogue of applications, microservices, mobile apps, and open-source contributions.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by keyword, architecture, or technology..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#18181b] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5500] transition-colors"
          />
        </div>

        {/* Total indicator */}
        <span className="text-xs text-[#A1A1AA] self-center">
          Showing <strong className="text-white">{filteredProjects.length}</strong> of{' '}
          <strong className="text-white">{projects.length}</strong> projects
        </span>
      </div>

      {/* Skills Filters */}
      {allSkills.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mb-12">
          <span className="text-xs text-[#A1A1AA] flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-[#FF5500]" /> Filter:
          </span>
          {allSkills.map((sk) => {
            const isSelected = selectedSkill === sk;
            return (
              <button
                key={sk}
                onClick={() => setSelectedSkill(sk)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#FF5500] text-white shadow-sm'
                    : 'bg-[#18181b] text-[#A1A1AA] hover:text-white border border-white/5'
                }`}
              >
                {sk}
              </button>
            );
          })}
        </div>
      )}

      {/* Projects Grid */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-2xl bg-[#18181b] border border-white/5 p-6 animate-pulse space-y-4">
              <div className="h-48 bg-white/5 rounded-xl" />
              <div className="h-6 w-3/4 bg-white/5 rounded" />
              <div className="h-4 w-full bg-white/5 rounded" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredProjects.length === 0 && (
        <div className="text-center py-20 rounded-2xl bg-[#18181b] border border-white/5">
          <p className="text-white font-semibold text-lg mb-2">No matching projects found</p>
          <p className="text-[#A1A1AA] text-xs">
            Try adjusting your search query or removing the selected skill filter.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedSkill('ALL');
            }}
            className="mt-5 px-4 py-2 rounded-lg bg-[#FF5500] text-white text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="group rounded-2xl bg-[#18181b] border border-white/10 hover:border-[#FF5500]/40 transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="relative h-48 w-full bg-black/40 overflow-hidden">
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-transparent to-transparent" />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <Link href={`/projects/${project.slug}`}>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FF5500] transition-colors mb-2 line-clamp-1">
                    {project.title}
                  </h3>
                </Link>
                <p className="text-xs text-[#A1A1AA] line-clamp-2 mb-4 leading-relaxed">
                  {project.tagline}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/5 text-[10px] text-[#A1A1AA]"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-white hover:text-[#FF5500] flex items-center gap-1 font-semibold transition-colors"
                >
                  Deep Dive <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-3 text-[#A1A1AA]">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
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
    </div>
  );
}
