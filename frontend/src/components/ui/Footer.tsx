import { Code2 } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#111113] py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:px-8 md:flex-row">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#FF5500]/30 bg-[#FF5500]/10 text-[#FF5500]">
            <Code2 className="h-4 w-4" />
          </div>

          <span className="text-sm font-semibold text-white">
            Full-Stack Developer & AI Engineer
          </span>
        </div>

        {/* Tech Stack */}
        <p className="text-center text-xs text-[#A1A1AA] md:text-left">
          Built with Next.js, TypeScript, Tailwind CSS, Three.js & PostgreSQL.
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-2">
          {/* GitHub */}
          <a
            href="https://github.com/YuvrajKashid05"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-lg p-2 text-[#A1A1AA] transition-all duration-300 hover:bg-[#FF5500]/10 hover:text-[#FF5500]"
            aria-label="GitHub Profile"
          >
            <FaGithub className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-lg p-2 text-[#A1A1AA] transition-all duration-300 hover:bg-[#FF5500]/10 hover:text-[#FF5500]"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedinIn className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          </a>

          {/* X */}
          <a
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-lg p-2 text-[#A1A1AA] transition-all duration-300 hover:bg-[#FF5500]/10 hover:text-[#FF5500]"
            aria-label="X Profile"
          >
            <FaXTwitter className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          </a>
        </div>
      </div>
    </footer>
  );
}
