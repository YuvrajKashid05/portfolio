'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, Project, Skill, Profile } from '@/lib/api';
import HeroSection from '@/components/public/HeroSection';
import FeaturedProjects from '@/components/public/FeaturedProjects';
import SkillsMatrix from '@/components/public/SkillsMatrix';
import ContactSection from '@/components/public/ContactSection';

// Client fallback data ensuring the portfolio is immediately interactive and resilient
const FALLBACK_PROFILE: Profile = {
  id: '1',
  name: 'Senior Full-Stack & Mobile Engineer',
  title: 'Full-Stack Web, Mobile & AI Solutions Architect',
  bio: 'Crafting high-scale web platforms, fluid React Native mobile apps, and low-latency Node/Python AI microservices. Specialized in resilient distributed architectures and delightful user interfaces.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com',
  twitterUrl: 'https://x.com',
};

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'OmniAgent ? Multimodal AI Reasoning Platform',
    slug: 'omniagent-multimodal-platform',
    tagline: 'Enterprise AI orchestration engine combining FastAPI microservices with real-time Next.js streaming UI.',
    description: 'A distributed platform that routes complex user reasoning chains across local LLM fine-tunes and multimodal vision models. Features real-time token streaming over WebSockets, vector search embeddings stored in PostgreSQL with pgvector, and an interactive 3D workflow canvas.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://omniagent-demo.example.com',
    repoUrl: 'https://github.com/example/omniagent',
    featured: true,
    sortOrder: 1,
    skills: [
      { id: 's1', name: 'Next.js', category: 'FRONTEND', sortOrder: 1 },
      { id: 's2', name: 'TypeScript', category: 'FRONTEND', sortOrder: 2 },
      { id: 's3', name: 'FastAPI', category: 'AI_ML', sortOrder: 1 },
      { id: 's4', name: 'PostgreSQL', category: 'DATABASE', sortOrder: 1 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    title: 'PulseTrack ? Cross-Platform Fitness & Biometrics Mobile App',
    slug: 'pulsetrack-react-native-fitness',
    tagline: 'High-performance React Native (Expo Router) app with offline-first SQLite sync and real-time telemetry graphs.',
    description: 'Native mobile experience for biometric performance tracking. Implements 60fps gesture-driven animations with react-native-reanimated, background BLE device telemetry synchronization, and secure biometric authentication.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://expo.dev/@example/pulsetrack',
    repoUrl: 'https://github.com/example/pulsetrack',
    featured: true,
    sortOrder: 2,
    skills: [
      { id: 's5', name: 'React Native', category: 'MOBILE', sortOrder: 1 },
      { id: 's6', name: 'Expo', category: 'MOBILE', sortOrder: 2 },
      { id: 's7', name: 'TypeScript', category: 'FRONTEND', sortOrder: 2 },
      { id: 's8', name: 'Node.js', category: 'BACKEND', sortOrder: 1 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    title: 'HyperLedger ? Distributed High-Throughput Ledger API',
    slug: 'hyperledger-distributed-api',
    tagline: 'Financial settlement microservice handling 15,000+ RPS with ACID transactional guarantees.',
    description: 'Engineered a mission-critical ledger backend in Node.js & Prisma backed by partitioned PostgreSQL and Redis pub/sub. Features strict idempotency keys, atomic balance checks, and automated reconciliation pipelines.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://hyperledger.example.com',
    repoUrl: 'https://github.com/example/hyperledger',
    featured: true,
    sortOrder: 3,
    skills: [
      { id: 's8', name: 'Node.js', category: 'BACKEND', sortOrder: 1 },
      { id: 's9', name: 'Prisma ORM', category: 'BACKEND', sortOrder: 2 },
      { id: 's4', name: 'PostgreSQL', category: 'DATABASE', sortOrder: 1 },
      { id: 's10', name: 'Docker', category: 'DEVOPS', sortOrder: 1 },
    ],
    createdAt: new Date().toISOString(),
  },
];

const FALLBACK_SKILLS: Skill[] = [
  { id: 'f1', name: 'Next.js', category: 'FRONTEND', proficiency: 95, sortOrder: 1 },
  { id: 'f2', name: 'React', category: 'FRONTEND', proficiency: 98, sortOrder: 2 },
  { id: 'f3', name: 'TypeScript', category: 'FRONTEND', proficiency: 95, sortOrder: 3 },
  { id: 'f4', name: 'Tailwind CSS', category: 'FRONTEND', proficiency: 95, sortOrder: 4 },
  { id: 'f5', name: 'Three.js / R3F', category: 'FRONTEND', proficiency: 85, sortOrder: 5 },
  { id: 'm1', name: 'React Native', category: 'MOBILE', proficiency: 94, sortOrder: 1 },
  { id: 'm2', name: 'Expo / Router', category: 'MOBILE', proficiency: 95, sortOrder: 2 },
  { id: 'b1', name: 'Node.js', category: 'BACKEND', proficiency: 96, sortOrder: 1 },
  { id: 'b2', name: 'Express', category: 'BACKEND', proficiency: 95, sortOrder: 2 },
  { id: 'b3', name: 'Prisma ORM', category: 'BACKEND', proficiency: 92, sortOrder: 3 },
  { id: 'd1', name: 'PostgreSQL', category: 'DATABASE', proficiency: 94, sortOrder: 1 },
  { id: 'd2', name: 'MongoDB', category: 'DATABASE', proficiency: 90, sortOrder: 2 },
  { id: 'a1', name: 'Python', category: 'AI_ML', proficiency: 90, sortOrder: 1 },
  { id: 'a2', name: 'FastAPI', category: 'AI_ML', proficiency: 92, sortOrder: 2 },
  { id: 'c1', name: 'Docker', category: 'DEVOPS', proficiency: 88, sortOrder: 1 },
  { id: 't1', name: 'Git & CI/CD', category: 'TOOLS', proficiency: 94, sortOrder: 1 },
];

export default function HomePage() {
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.getProfile(),
    retry: 1,
  });

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: () => api.getProjects({ featured: true }),
    retry: 1,
  });

  const { data: skillsData } = useQuery({
    queryKey: ['skills'],
    queryFn: () => api.getSkills(),
    retry: 1,
  });

  const profile = profileData?.profile || FALLBACK_PROFILE;
  const projects = projectsData?.projects || FALLBACK_PROJECTS;
  const skills = skillsData?.skills || FALLBACK_SKILLS;

  return (
    <>
      <HeroSection profile={profile} />
      <FeaturedProjects projects={projects} isLoading={projectsLoading && !projectsData} />
      <SkillsMatrix skills={skills} />
      <ContactSection profile={profile} />
    </>
  );
}
