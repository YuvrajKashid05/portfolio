"use client";

import { Skill } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import {
  Cloud,
  Cpu,
  Database,
  Layout,
  Smartphone,
  Terminal,
  Wrench,
} from "lucide-react";
import React, { useState } from "react";

interface SkillsMatrixProps {
  skills: Skill[];
}

const CATEGORY_MAP: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  FRONTEND: { label: "Frontend", icon: Layout },
  BACKEND: { label: "Backend APIs", icon: Terminal },
  DATABASE: { label: "Databases", icon: Database },
  MOBILE: { label: "Mobile Apps", icon: Smartphone },
  AI_ML: { label: "AI & Python", icon: Cpu },
  DEVOPS: { label: "DevOps & Cloud", icon: Cloud },
  TOOLS: { label: "Tooling & CI/CD", icon: Wrench },
};

export default function SkillsMatrix({ skills }: SkillsMatrixProps) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const categories = [
    "ALL",
    ...Array.from(new Set(skills.map((s) => s.category))),
  ];

  const filteredSkills =
    activeCategory === "ALL"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <section
      id="skills"
      className="py-24 bg-[#111113] border-y border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500] text-xs font-semibold uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5" /> Technical Arsenal
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Engineered Across The Full Stack
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1AA]">
            Production-hardened mastery across reactive client runtimes,
            distributed cloud services, and machine learning pipelines.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const label =
              cat === "ALL" ? "All Skills" : CATEGORY_MAP[cat]?.label || cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/30 scale-105"
                    : "bg-[#18181b] text-[#A1A1AA] hover:text-white hover:bg-[#232328] border border-white/5"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          <AnimatePresence>
            {filteredSkills.map((skill) => {
              const CategoryIcon =
                CATEGORY_MAP[skill.category]?.icon || Terminal;
              return (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="group relative p-4 rounded-xl bg-[#18181b] border border-white/5 hover:border-[#FF5500]/40 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF5500]/10 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#FF5500] group-hover:bg-[#FF5500]/10 transition-colors">
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                    {skill.proficiency && (
                      <span className="text-[11px] font-semibold text-[#A1A1AA] group-hover:text-white transition-colors">
                        {skill.proficiency}%
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#FF5500] transition-colors line-clamp-1 mb-1.5">
                      {skill.name}
                    </h4>

                    {/* Proficiency progress bar */}
                    {skill.proficiency ? (
                      <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#FF5500] to-[#FF6B35] h-full rounded-full transition-all duration-500"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">
                        {skill.category}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
