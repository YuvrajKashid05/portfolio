"use client";

import {
  api,
  ApiError,
  CreateProjectInput,
  CreateSkillInput,
  Skill,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Cpu,
  ExternalLink,
  Layers,
  Loader2,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Shield,
  Star,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const emptyProjectForm = {
  title: "",
  slug: "",
  tagline: "",
  description: "",
  thumbnailUrl: "",
  demoUrl: "",
  repoUrl: "",
  featured: false,
  skillIds: [] as string[],
};

const emptySkillForm = {
  name: "",
  category: "FRONTEND" as Skill["category"],
  proficiency: 90,
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<
    "projects" | "skills" | "contacts"
  >("projects");

  const [authChecked, setAuthChecked] = useState(false);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  const [projectForm, setProjectForm] = useState({
    ...emptyProjectForm,
  });

  const [skillForm, setSkillForm] = useState({
    ...emptySkillForm,
  });

  // Auth Guard
  useEffect(() => {
    const token = localStorage.getItem("portfolio_token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    api
      .getMe()
      .then(() => {
        setAuthChecked(true);
      })
      .catch(() => {
        localStorage.removeItem("portfolio_token");
        router.push("/admin/login");
      });
  }, [router]);

  // Queries
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: () => api.getProjects(),
    enabled: authChecked,
  });

  const { data: skillsData, isLoading: skillsLoading } = useQuery({
    queryKey: ["admin", "skills"],
    queryFn: () => api.getSkills(),
    enabled: authChecked,
  });

  const { data: contactsData, isLoading: contactsLoading } = useQuery({
    queryKey: ["admin", "contacts"],
    queryFn: () => api.getContacts(),
    enabled: authChecked,
  });

  // Create Project
  const createProjectMutation = useMutation({
    mutationFn: (newProject: CreateProjectInput) =>
      api.createProject(newProject),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "projects"],
      });

      setIsProjectModalOpen(false);
      setProjectForm({ ...emptyProjectForm });
    },
  });

  // Delete Project
  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => api.deleteProject(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "projects"],
      });
    },
  });

  // Create Skill
  const createSkillMutation = useMutation({
    mutationFn: (newSkill: CreateSkillInput) => api.createSkill(newSkill),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "skills"],
      });

      setIsSkillModalOpen(false);
      setSkillForm({ ...emptySkillForm });
    },
  });

  // Delete Skill
  const deleteSkillMutation = useMutation({
    mutationFn: (id: string) => api.deleteSkill(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "skills"],
      });
    },
  });

  // Update Contact Status
  const updateContactStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "UNREAD" | "READ" | "ARCHIVED" | "SPAM";
    }) => api.updateContactStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "contacts"],
      });
    },
  });

  // Delete Contact
  const deleteContactMutation = useMutation({
    mutationFn: (id: string) => api.deleteContact(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "contacts"],
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("portfolio_token");
    router.push("/");
  };

  const handleCreateProject = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /*
     * IMPORTANT:
     *
     * The backend schema accepts optional values as undefined/null,
     * but an empty string "" is still a string and fails URL validation.
     *
     * Therefore:
     * "" -> undefined
     *
     * This fixes the HTTP 400 from POST /api/projects.
     */
    const payload: CreateProjectInput = {
      title: projectForm.title.trim(),
      tagline: projectForm.tagline.trim(),
      description: projectForm.description.trim(),
      thumbnailUrl: projectForm.thumbnailUrl.trim(),
      featured: projectForm.featured,
      skillIds: projectForm.skillIds,
      slug: projectForm.slug.trim() || undefined,
      demoUrl: projectForm.demoUrl.trim() || undefined,
      repoUrl: projectForm.repoUrl.trim() || undefined,
    };

    createProjectMutation.mutate(payload);
  };

  const handleCreateSkill = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CreateSkillInput = {
      name: skillForm.name.trim(),
      category: skillForm.category,
      proficiency: skillForm.proficiency,
      sortOrder: 0,
    };

    createSkillMutation.mutate(payload);
  };

  const getProjectError = () => {
    const error = createProjectMutation.error;

    if (!error) return null;

    if (error instanceof ApiError) {
      if (error.details?.length) {
        return error.details
          .map((detail) => {
            const path = detail.path ? `${detail.path}: ` : "";

            return `${path}${detail.message || "Invalid value"}`;
          })
          .join(" • ");
      }

      return error.message;
    }

    return error instanceof Error ? error.message : "Failed to create project.";
  };

  const projects = projectsData?.projects || [];
  const skills = skillsData?.skills || [];
  const contacts = contactsData?.contacts || [];

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111113]">
        <div className="flex items-center gap-3 text-white text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#FF5500]" />
          Validating Admin Session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 max-w-7xl mx-auto px-6 sm:px-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500] text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            CMS Dashboard
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Portfolio Admin Panel
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => queryClient.invalidateQueries()}
            className="p-2.5 rounded-xl bg-[#18181b] border border-white/10 text-[#A1A1AA] hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#18181b] border border-white/10 text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("projects")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === "projects"
              ? "bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/30"
              : "text-[#A1A1AA] hover:text-white bg-[#18181b]"
          }`}
        >
          <Layers className="w-4 h-4" />
          Projects ({projects.length})
        </button>

        <button
          onClick={() => setActiveTab("skills")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === "skills"
              ? "bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/30"
              : "text-[#A1A1AA] hover:text-white bg-[#18181b]"
          }`}
        >
          <Cpu className="w-4 h-4" />
          Skills ({skills.length})
        </button>

        <button
          onClick={() => setActiveTab("contacts")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === "contacts"
              ? "bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/30"
              : "text-[#A1A1AA] hover:text-white bg-[#18181b]"
          }`}
        >
          <Mail className="w-4 h-4" />
          Inquiries ({contacts.length})
          {contactsData?.unreadCount ? (
            <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
          ) : null}
        </button>
      </div>

      {/* PROJECTS */}
      {activeTab === "projects" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Project Records</h2>

            <button
              onClick={() => {
                createProjectMutation.reset();
                setProjectForm({ ...emptyProjectForm });
                setIsProjectModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5500] text-white text-xs font-semibold hover:bg-[#FF6B35] transition-all shadow-md shadow-[#FF5500]/25"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>

          {projectsLoading ? (
            <div className="py-12 text-center text-[#A1A1AA] text-sm">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="py-12 text-center text-[#A1A1AA] text-sm bg-[#18181b] rounded-xl">
              No projects created yet. Click Add Project to publish one.
            </div>
          ) : (
            <div className="rounded-2xl bg-[#18181b] border border-white/10 overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm text-[#A1A1AA]">
                <thead className="bg-white/[0.02] border-b border-white/10 text-xs font-semibold text-white uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Cover</th>
                    <th className="p-4">Title & Slug</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4">Technologies</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {projects.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4">
                        <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-black/40">
                          <Image
                            src={p.thumbnailUrl}
                            alt={p.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="block font-bold text-white line-clamp-1">
                          {p.title}
                        </span>

                        <span className="text-xs text-[#A1A1AA]">
                          /{p.slug}
                        </span>
                      </td>

                      <td className="p-4">
                        {p.featured ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5500]/20 text-[#FF5500]">
                            <Star className="w-3 h-3 fill-[#FF5500]" />
                            Yes
                          </span>
                        ) : (
                          <span className="text-xs text-[#A1A1AA]">No</span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.skills.slice(0, 3).map((s) => (
                            <span
                              key={s.id}
                              className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-white"
                            >
                              {s.name}
                            </span>
                          ))}

                          {p.skills.length > 3 && (
                            <span className="text-[10px] text-[#A1A1AA]">
                              +{p.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/projects/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-[#A1A1AA] hover:text-white"
                            title="View"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => {
                              if (confirm(`Delete project "${p.title}"?`)) {
                                deleteProjectMutation.mutate(p.id);
                              }
                            }}
                            className="p-2 text-red-400 hover:text-red-300"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SKILLS */}
      {activeTab === "skills" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Configured Skills</h2>

            <button
              onClick={() => {
                createSkillMutation.reset();
                setSkillForm({ ...emptySkillForm });
                setIsSkillModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5500] text-white text-xs font-semibold hover:bg-[#FF6B35] transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Skill
            </button>
          </div>

          {skillsLoading ? (
            <div className="py-12 text-center text-[#A1A1AA] text-sm">
              Loading skills...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {skills.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl bg-[#18181b] border border-white/5 flex items-center justify-between group"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{s.name}</h4>

                    <span className="text-[11px] text-[#A1A1AA]">
                      {s.category}
                    </span>

                    {s.proficiency ? (
                      <div className="text-[10px] text-[#FF5500] font-semibold mt-1">
                        {s.proficiency}% Proficiency
                      </div>
                    ) : null}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Delete skill "${s.name}"?`)) {
                        deleteSkillMutation.mutate(s.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-300 transition-opacity"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONTACTS */}
      {activeTab === "contacts" && (
        <div>
          <h2 className="text-xl font-bold text-white mb-6">
            Contact Inquiries Inbox
          </h2>

          {contactsLoading ? (
            <div className="py-12 text-center text-[#A1A1AA] text-sm">
              Loading inquiries...
            </div>
          ) : contacts.length === 0 ? (
            <div className="py-12 text-center text-[#A1A1AA] text-sm bg-[#18181b] rounded-xl">
              No inquiries received yet.
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    c.status === "UNREAD"
                      ? "bg-[#18181b] border-[#FF5500]/50 shadow-md shadow-[#FF5500]/5"
                      : "bg-[#18181b]/60 border-white/5 opacity-85"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <span className="font-bold text-white text-base mr-3">
                        {c.name}
                      </span>

                      <a
                        href={`mailto:${c.email}`}
                        className="text-xs text-[#FF5500] hover:underline"
                      >
                        {c.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          c.status === "UNREAD"
                            ? "bg-[#FF5500]/20 text-[#FF5500]"
                            : "bg-white/5 text-[#A1A1AA]"
                        }`}
                      >
                        {c.status}
                      </span>

                      {c.status === "UNREAD" && (
                        <button
                          onClick={() =>
                            updateContactStatusMutation.mutate({
                              id: c.id,
                              status: "READ",
                            })
                          }
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-white"
                        >
                          Mark Read
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm("Delete this inquiry?")) {
                            deleteContactMutation.mutate(c.id);
                          }
                        }}
                        className="p-1 text-red-400 hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {c.subject && (
                    <h4 className="text-xs font-semibold text-white mb-2">
                      Subject: {c.subject}
                    </h4>
                  )}

                  <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-line">
                    {c.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#18181b] border border-white/10 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                Create New Project
              </h3>

              <button
                onClick={() => {
                  createProjectMutation.reset();
                  setIsProjectModalOpen(false);
                }}
                className="p-1 text-[#A1A1AA] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createProjectMutation.isError && (
              <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />

                <div>
                  <p className="text-xs font-semibold text-red-300">
                    Unable to create project
                  </p>

                  <p className="text-xs text-red-400 mt-1 leading-relaxed">
                    {getProjectError()}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                  Project Title
                </label>

                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Distributed Payment Ledger"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                  Slug
                </label>

                <input
                  type="text"
                  value={projectForm.slug}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      slug: e.target.value.toLowerCase(),
                    })
                  }
                  placeholder="learnos"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5500]"
                />

                <p className="mt-1 text-[10px] text-[#71717A]">
                  Optional. Leave empty to generate automatically from the
                  title.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                  Tagline
                </label>

                <input
                  type="text"
                  required
                  value={projectForm.tagline}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      tagline: e.target.value,
                    })
                  }
                  placeholder="e.g. High-throughput learning platform powered by AI"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                  Description / Architecture Details
                </label>

                <textarea
                  required
                  rows={4}
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Detail the technical architecture, problem statement, key challenges, and solutions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5500] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                    Thumbnail Image URL
                  </label>

                  <input
                    type="url"
                    required
                    value={projectForm.thumbnailUrl}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        thumbnailUrl: e.target.value,
                      })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                    Live Demo URL
                  </label>

                  <input
                    type="url"
                    value={projectForm.demoUrl}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        demoUrl: e.target.value,
                      })
                    }
                    placeholder="https://app.example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                  GitHub Repo URL
                </label>

                <input
                  type="url"
                  value={projectForm.repoUrl}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      repoUrl: e.target.value,
                    })
                  }
                  placeholder="https://github.com/username/repo"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={projectForm.featured}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      featured: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded bg-[#111113] border-white/20 text-[#FF5500] focus:ring-0"
                />

                <label
                  htmlFor="featured"
                  className="text-xs font-semibold text-white"
                >
                  Mark as Featured Project on Homepage
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-2">
                  Associate Skills
                </label>

                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-[#111113] rounded-xl border border-white/5">
                  {skills.map((s) => {
                    const isChecked = projectForm.skillIds.includes(s.id);

                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => {
                          if (isChecked) {
                            setProjectForm({
                              ...projectForm,
                              skillIds: projectForm.skillIds.filter(
                                (id) => id !== s.id,
                              ),
                            });
                          } else {
                            setProjectForm({
                              ...projectForm,
                              skillIds: [...projectForm.skillIds, s.id],
                            });
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          isChecked
                            ? "bg-[#FF5500] text-white"
                            : "bg-white/5 text-[#A1A1AA] hover:text-white"
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    createProjectMutation.reset();
                    setIsProjectModalOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-xs text-white hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createProjectMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-[#FF5500] text-xs font-semibold text-white hover:bg-[#FF6B35] shadow-md shadow-[#FF5500]/30 disabled:opacity-50"
                >
                  {createProjectMutation.isPending
                    ? "Saving..."
                    : "Save & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SKILL MODAL */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#18181b] border border-white/10 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Add New Skill</h3>

              <button
                onClick={() => {
                  createSkillMutation.reset();
                  setIsSkillModalOpen(false);
                }}
                className="p-1 text-[#A1A1AA] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createSkillMutation.isError && (
              <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />

                <p className="text-xs text-red-400">
                  {createSkillMutation.error instanceof Error
                    ? createSkillMutation.error.message
                    : "Failed to create skill."}
                </p>
              </div>
            )}

            <form onSubmit={handleCreateSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                  Skill Name
                </label>

                <input
                  type="text"
                  required
                  value={skillForm.name}
                  onChange={(e) =>
                    setSkillForm({
                      ...skillForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. GraphQL, Tailwind CSS, PyTorch"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5500]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                  Category
                </label>

                <select
                  value={skillForm.category}
                  onChange={(e) =>
                    setSkillForm({
                      ...skillForm,
                      category: e.target.value as Skill["category"],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5500]"
                >
                  <option value="FRONTEND">FRONTEND</option>
                  <option value="BACKEND">BACKEND</option>
                  <option value="DATABASE">DATABASE</option>
                  <option value="MOBILE">MOBILE</option>
                  <option value="AI_ML">AI_ML</option>
                  <option value="DEVOPS">DEVOPS</option>
                  <option value="TOOLS">TOOLS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                  Proficiency ({skillForm.proficiency}%)
                </label>

                <input
                  type="range"
                  min="1"
                  max="100"
                  value={skillForm.proficiency}
                  onChange={(e) =>
                    setSkillForm({
                      ...skillForm,
                      proficiency: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full accent-[#FF5500]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    createSkillMutation.reset();
                    setIsSkillModalOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-xs text-white hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createSkillMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-[#FF5500] text-xs font-semibold text-white hover:bg-[#FF6B35] shadow-md shadow-[#FF5500]/30 disabled:opacity-50"
                >
                  {createSkillMutation.isPending ? "Saving..." : "Add Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
