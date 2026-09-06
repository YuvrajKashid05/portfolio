import { PrismaClient, SkillCategory, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  await prisma.projectsOnSkills.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('AdminSecretPass123!', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@portfolio.dev',
      passwordHash,
      name: 'Senior Full-Stack & Mobile Engineer',
      title: 'Full-Stack Web, Mobile & AI Solutions Architect',
      bio: 'Crafting high-scale web platforms, fluid React Native mobile apps, and low-latency Node/Python AI microservices. Specialized in resilient distributed architectures and delightful user interfaces.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      resumeUrl: 'https://example.com/resume.pdf',
      githubUrl: 'https://github.com',
      linkedinUrl: 'https://linkedin.com',
      twitterUrl: 'https://x.com',
      role: Role.ADMIN,
    },
  });
  console.log('Admin created: ' + admin.email);

  const skillsData = [
    { name: 'Next.js', category: SkillCategory.FRONTEND, icon: 'SiNextdotjs', proficiency: 95, sortOrder: 1 },
    { name: 'React', category: SkillCategory.FRONTEND, icon: 'SiReact', proficiency: 98, sortOrder: 2 },
    { name: 'TypeScript', category: SkillCategory.FRONTEND, icon: 'SiTypescript', proficiency: 95, sortOrder: 3 },
    { name: 'Tailwind CSS', category: SkillCategory.FRONTEND, icon: 'SiTailwindcss', proficiency: 95, sortOrder: 4 },
    { name: 'Three.js / R3F', category: SkillCategory.FRONTEND, icon: 'SiThreedotjs', proficiency: 85, sortOrder: 5 },
    { name: 'TanStack Query', category: SkillCategory.FRONTEND, icon: 'SiReactquery', proficiency: 92, sortOrder: 6 },
    { name: 'React Native', category: SkillCategory.MOBILE, icon: 'SiReact', proficiency: 94, sortOrder: 1 },
    { name: 'Expo / Expo Router', category: SkillCategory.MOBILE, icon: 'SiExpo', proficiency: 95, sortOrder: 2 },
    { name: 'Node.js', category: SkillCategory.BACKEND, icon: 'SiNodedotjs', proficiency: 96, sortOrder: 1 },
    { name: 'Express', category: SkillCategory.BACKEND, icon: 'SiExpress', proficiency: 95, sortOrder: 2 },
    { name: 'NestJS', category: SkillCategory.BACKEND, icon: 'SiNestjs', proficiency: 88, sortOrder: 3 },
    { name: 'Prisma ORM', category: SkillCategory.BACKEND, icon: 'SiPrisma', proficiency: 92, sortOrder: 4 },
    { name: 'PostgreSQL', category: SkillCategory.DATABASE, icon: 'SiPostgresql', proficiency: 94, sortOrder: 1 },
    { name: 'MongoDB', category: SkillCategory.DATABASE, icon: 'SiMongodb', proficiency: 90, sortOrder: 2 },
    { name: 'Redis', category: SkillCategory.DATABASE, icon: 'SiRedis', proficiency: 88, sortOrder: 3 },
    { name: 'Python', category: SkillCategory.AI_ML, icon: 'SiPython', proficiency: 90, sortOrder: 1 },
    { name: 'FastAPI', category: SkillCategory.AI_ML, icon: 'SiFastapi', proficiency: 92, sortOrder: 2 },
    { name: 'LangChain / RAG', category: SkillCategory.AI_ML, icon: 'SiOpenai', proficiency: 86, sortOrder: 3 },
    { name: 'Docker', category: SkillCategory.DEVOPS, icon: 'SiDocker', proficiency: 88, sortOrder: 1 },
    { name: 'Postman / REST', category: SkillCategory.TOOLS, icon: 'SiPostman', proficiency: 95, sortOrder: 1 },
    { name: 'Git & GitHub Actions', category: SkillCategory.TOOLS, icon: 'SiGithub', proficiency: 94, sortOrder: 2 },
  ];

  const createdSkills: Record<string, string> = {};
  for (const s of skillsData) {
    const created = await prisma.skill.create({ data: s });
    createdSkills[s.name] = created.id;
  }
  console.log('Created ' + Object.keys(createdSkills).length + ' skills');

  const projectsData = [
    {
      title: 'OmniAgent — Multimodal AI Reasoning Platform',
      slug: 'omniagent-multimodal-platform',
      tagline: 'Enterprise AI orchestration engine combining FastAPI microservices with real-time Next.js streaming UI.',
      description: 'A distributed platform that routes complex user reasoning chains across local LLM fine-tunes and multimodal vision models. Features real-time token streaming over WebSockets, vector search embeddings stored in PostgreSQL with pgvector, and an interactive 3D workflow canvas.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://omniagent-demo.example.com',
      repoUrl: 'https://github.com/example/omniagent',
      featured: true,
      sortOrder: 1,
      skills: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'FastAPI', 'Python', 'PostgreSQL'],
    },
    {
      title: 'PulseTrack — Cross-Platform Fitness & Biometrics Mobile App',
      slug: 'pulsetrack-react-native-fitness',
      tagline: 'High-performance React Native (Expo Router) app with offline-first SQLite sync and real-time telemetry graphs.',
      description: 'Native mobile experience for biometric performance tracking. Implements 60fps gesture-driven animations with react-native-reanimated, background BLE device telemetry synchronization, and secure biometric authentication.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://expo.dev/@example/pulsetrack',
      repoUrl: 'https://github.com/example/pulsetrack',
      featured: true,
      sortOrder: 2,
      skills: ['React Native', 'Expo / Expo Router', 'TypeScript', 'Node.js', 'PostgreSQL'],
    },
    {
      title: 'HyperLedger — Distributed High-Throughput Ledger API',
      slug: 'hyperledger-distributed-api',
      tagline: 'Financial settlement microservice handling 15,000+ RPS with ACID transactional guarantees.',
      description: 'Engineered a mission-critical ledger backend in Node.js & Prisma backed by partitioned PostgreSQL and Redis pub/sub. Features strict idempotency keys, atomic balance checks, and automated reconciliation pipelines.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://hyperledger.example.com',
      repoUrl: 'https://github.com/example/hyperledger',
      featured: true,
      sortOrder: 3,
      skills: ['Node.js', 'Express', 'Prisma ORM', 'PostgreSQL', 'Redis', 'Docker'],
    },
  ];

  for (const p of projectsData) {
    const { skills, ...projectFields } = p;
    const project = await prisma.project.create({
      data: {
        ...projectFields,
        userId: admin.id,
        skills: {
          create: skills.map((name) => ({
            skillId: createdSkills[name],
          })),
        },
      },
    });
    console.log('Project created: ' + project.title);
  }

  await prisma.contact.create({
    data: {
      name: 'Elena Rostova',
      email: 'elena@techventures.io',
      subject: 'Inquiry: Senior Full-Stack Architecture Role',
      message: 'Hello! I came across your portfolio and was blown away by the depth of your full-stack engineering and mobile work. We are scaling our core platform team and would love to schedule an introductory call.',
      status: 'UNREAD',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
