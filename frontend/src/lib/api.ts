const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Skill {
  id: string;
  name: string;
  category: 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'MOBILE' | 'AI_ML' | 'DEVOPS' | 'TOOLS';
  icon?: string | null;
  proficiency?: number | null;
  sortOrder: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  thumbnailUrl: string;
  demoUrl?: string | null;
  repoUrl?: string | null;
  featured: boolean;
  sortOrder: number;
  skills: Skill[];
  createdAt: string;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatarUrl?: string | null;
  resumeUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED' | 'SPAM';
  createdAt: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('portfolio_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = 'Bearer ' + token;
  }

  const res = await fetch(API_BASE + endpoint, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || 'An error occurred during request');
  }

  return data;
}

export const api = {
  getProfile: () => request<{ success: boolean; profile: Profile }>('/profile'),
  getProjects: (params?: { featured?: boolean; search?: string; skill?: string }) => {
    const q = new URLSearchParams();
    if (params?.featured !== undefined) q.append('featured', String(params.featured));
    if (params?.search) q.append('search', params.search);
    if (params?.skill) q.append('skill', params.skill);
    const qs = q.toString();
    return request<{ success: boolean; projects: Project[] }>('/projects' + (qs ? '?' + qs : ''));
  },
  getProject: (identifier: string) =>
    request<{ success: boolean; project: Project }>('/projects/' + identifier),
  getSkills: () =>
    request<{ success: boolean; skills: Skill[]; grouped: Record<string, Skill[]> }>('/skills'),
  submitContact: (data: { name: string; email: string; subject?: string; message: string; website?: string }) =>
    request<{ success: boolean; message: string }>('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  login: (credentials: { email: string; password: string }) =>
    request<{ success: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => request<{ success: boolean; user: any }>('/auth/me'),
  updateProfile: (profile: Partial<Profile>) =>
    request<{ success: boolean; profile: Profile }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),
  createProject: (project: any) =>
    request<{ success: boolean; project: Project }>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    }),
  updateProject: (id: string, project: any) =>
    request<{ success: boolean; project: Project }>('/projects/' + id, {
      method: 'PUT',
      body: JSON.stringify(project),
    }),
  deleteProject: (id: string) =>
    request<{ success: boolean; deletedId: string }>('/projects/' + id, {
      method: 'DELETE',
    }),
  createSkill: (skill: any) =>
    request<{ success: boolean; skill: Skill }>('/skills', {
      method: 'POST',
      body: JSON.stringify(skill),
    }),
  updateSkill: (id: string, skill: any) =>
    request<{ success: boolean; skill: Skill }>('/skills/' + id, {
      method: 'PUT',
      body: JSON.stringify(skill),
    }),
  deleteSkill: (id: string) =>
    request<{ success: boolean; deletedId: string }>('/skills/' + id, {
      method: 'DELETE',
    }),
  getContacts: (status?: string) =>
    request<{ success: boolean; contacts: Contact[]; unreadCount: number }>('/contacts' + (status ? '?status=' + status : '')),
  updateContactStatus: (id: string, status: string) =>
    request<{ success: boolean; contact: Contact }>('/contacts/' + id + '/status', {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteContact: (id: string) =>
    request<{ success: boolean; deletedId: string }>('/contacts/' + id, {
      method: 'DELETE',
    }),
};
