const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type SkillCategory =
  | "FRONTEND"
  | "BACKEND"
  | "DATABASE"
  | "MOBILE"
  | "AI_ML"
  | "DEVOPS"
  | "TOOLS";

export type ContactStatus = "UNREAD" | "READ" | "ARCHIVED" | "SPAM";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon?: string | null;
  proficiency?: number | null;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
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
  updatedAt?: string;
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
  status: ContactStatus;
  createdAt: string;
}

export interface CreateProjectInput {
  title: string;
  slug?: string;
  tagline: string;
  description: string;
  thumbnailUrl: string;
  demoUrl?: string | null;
  repoUrl?: string | null;
  featured?: boolean;
  sortOrder?: number;
  skillIds?: string[];
}

export interface UpdateProjectInput {
  title?: string;
  slug?: string;
  tagline?: string;
  description?: string;
  thumbnailUrl?: string;
  demoUrl?: string | null;
  repoUrl?: string | null;
  featured?: boolean;
  sortOrder?: number;
  skillIds?: string[];
}

export interface CreateSkillInput {
  name: string;
  category: SkillCategory;
  icon?: string | null;
  proficiency?: number | null;
  sortOrder?: number;
}

export interface UpdateSkillInput {
  name?: string;
  category?: SkillCategory;
  icon?: string | null;
  proficiency?: number | null;
  sortOrder?: number;
}

interface ApiValidationDetail {
  path?: string;
  message?: string;
  code?: string;
}

interface ApiErrorResponse {
  error?: {
    code?: string;
    message?: string;
    details?: ApiValidationDetail[];
  };
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: ApiValidationDetail[];

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: ApiValidationDetail[],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("portfolio_token")
      : null;

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(API_BASE + endpoint, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError(
      "Unable to connect to the API server. Make sure the backend is running.",
      0,
      "NETWORK_ERROR",
    );
  }

  const rawText = await response.text();

  let data: T | ApiErrorResponse | null = null;

  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorData = data as ApiErrorResponse | null;

    const message =
      errorData?.error?.message ||
      (rawText && !rawText.startsWith("<")
        ? rawText
        : `Request failed with status ${response.status}`);

    throw new ApiError(
      message,
      response.status,
      errorData?.error?.code,
      errorData?.error?.details,
    );
  }

  return data as T;
}

export const api = {
  // Profile
  getProfile: () =>
    request<{ success: boolean; profile: Profile }>("/profile"),

  updateProfile: (profile: Partial<Profile>) =>
    request<{ success: boolean; profile: Profile }>("/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    }),

  // Projects
  getProjects: (params?: {
    featured?: boolean;
    search?: string;
    skill?: string;
  }) => {
    const q = new URLSearchParams();

    if (params?.featured !== undefined) {
      q.append("featured", String(params.featured));
    }

    if (params?.search) {
      q.append("search", params.search);
    }

    if (params?.skill) {
      q.append("skill", params.skill);
    }

    const qs = q.toString();

    return request<{
      success: boolean;
      count?: number;
      projects: Project[];
    }>("/projects" + (qs ? `?${qs}` : ""));
  },

  getProject: (identifier: string) =>
    request<{ success: boolean; project: Project }>(
      `/projects/${encodeURIComponent(identifier)}`,
    ),

  createProject: (project: CreateProjectInput) =>
    request<{ success: boolean; project: Project }>("/projects", {
      method: "POST",
      body: JSON.stringify(project),
    }),

  updateProject: (id: string, project: UpdateProjectInput) =>
    request<{ success: boolean; project: Project }>(
      `/projects/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        body: JSON.stringify(project),
      },
    ),

  deleteProject: (id: string) =>
    request<{ success: boolean; deletedId: string }>(
      `/projects/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    ),

  // Skills
  getSkills: () =>
    request<{
      success: boolean;
      skills: Skill[];
      grouped: Record<string, Skill[]>;
    }>("/skills"),

  createSkill: (skill: CreateSkillInput) =>
    request<{ success: boolean; skill: Skill }>("/skills", {
      method: "POST",
      body: JSON.stringify(skill),
    }),

  updateSkill: (id: string, skill: UpdateSkillInput) =>
    request<{ success: boolean; skill: Skill }>(
      `/skills/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        body: JSON.stringify(skill),
      },
    ),

  deleteSkill: (id: string) =>
    request<{ success: boolean; deletedId: string }>(
      `/skills/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    ),

  // Contact
  submitContact: (data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    website?: string;
  }) =>
    request<{ success: boolean; message: string }>("/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getContacts: (status?: ContactStatus) =>
    request<{
      success: boolean;
      contacts: Contact[];
      unreadCount: number;
      total?: number;
    }>(
      "/contacts" +
        (status ? `?status=${encodeURIComponent(status)}` : ""),
    ),

  updateContactStatus: (id: string, status: ContactStatus) =>
    request<{ success: boolean; contact: Contact }>(
      `/contacts/${encodeURIComponent(id)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
    ),

  deleteContact: (id: string) =>
    request<{ success: boolean; deletedId: string }>(
      `/contacts/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    ),

  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{
      success: boolean;
      token: string;
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getMe: () =>
    request<{
      success: boolean;
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }>("/auth/me"),
};