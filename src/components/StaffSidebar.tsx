"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "@/Images/logo.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Pill,
  Boxes,
  CalendarDays,
  ClipboardList,
  ChevronDown,
  LogOut,
  type LucideIcon,
} from "lucide-react";

const HOME_HREF = "/staff/dashboard";

type SubItem = { label: string; href: string };

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: SubItem[];
};

// Add or remove entries here, the sidebar renders whatever is in this array.
const navItems: NavItem[] = [
  { label: "Dashboard", href: "/staff/dashboard", icon: LayoutDashboard },
  {
    label: "Patients",
    href: "/staff/patients",
    icon: Users,
    children: [
      { label: "All Patients", href: "/staff/patients" },
      { label: "Add Patient", href: "/staff/patients/new" },
    ],
  },
  { label: "Medical Reports", href: "/staff/medical-reports", icon: FileText },
  { label: "Pharmacy", href: "/staff/pharmacy", icon: Pill },
  { label: "Inventory", href: "/staff/inventory", icon: Boxes },
  {
    label: "Appointment",
    href: "/staff/appointments",
    icon: CalendarDays,
    children: [
      { label: "All Appointments", href: "/staff/appointments" },
      { label: "Schedule", href: "/staff/appointments/schedule" },
    ],
  },
  { label: "Duties", href: "/staff/duties", icon: ClipboardList },
];

// Icon tile colours, cycled by position in navItems.
const ACCENTS = [
  "bg-sky-400/15 text-sky-300",
  "bg-violet-400/15 text-violet-300",
  "bg-emerald-400/15 text-emerald-300",
  "bg-amber-400/15 text-amber-300",
  "bg-rose-400/15 text-rose-300",
  "bg-teal-400/15 text-teal-300",
  "bg-indigo-400/15 text-indigo-300",
  "bg-cyan-400/15 text-cyan-300",
];

export default function StaffSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const matches = (href: string) =>
    href !== "#" && (pathname === href || pathname.startsWith(href + "/"));

  // Children use an exact match so "All Patients" doesn't stay lit on /staff/patients/new
  const matchesExact = (href: string) => pathname === href;

  const isItemActive = (item: NavItem) =>
    matches(item.href) || !!item.children?.some((c) => matches(c.href));

  const [openMenu, setOpenMenu] = useState<string | null>(
    () =>
      navItems.find((i) => i.children?.length && isItemActive(i))?.label ??
      null
  );

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('role')
    router.replace("/");
  };

  return (
    <aside className="relative flex h-screen w-72 shrink-0 flex-col overflow-hidden bg-gradient-to-b from-[#081a30] via-[#0c2746] to-[#0a1d38] text-slate-300 shadow-2xl">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

      {/* Logo */}
      <div className="relative shrink-0 px-5 pb-4 pt-6">
        <Link
          href={HOME_HREF}
          aria-label="Home"
          className="flex h-16 items-center justify-center px-2"
        >
          <Image
            src={logo}
            alt="Logo"
            priority
            className="h-14 w-auto object-contain drop-shadow-[0_2px_12px_rgba(56,189,248,0.25)]"
          />
        </Link>
        <div className="mt-5 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 space-y-1 overflow-y-auto px-4 pb-4 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isItemActive(item);
          const hasChildren = !!item.children?.length;
          const expanded = openMenu === item.label;
          const accent = ACCENTS[index % ACCENTS.length];

          const rowClass = `group relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-200 ${active
            ? "bg-gradient-to-r from-sky-500/25 via-indigo-500/15 to-transparent text-white ring-1 ring-sky-400/30 shadow-[0_0_24px_-8px_rgba(56,189,248,0.6)]"
            : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
            }`;

          const content = (
            <>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${active
                  ? "bg-gradient-to-br from-sky-400 to-indigo-500 text-white shadow-md shadow-sky-500/30"
                  : `${accent} group-hover:scale-105`
                  }`}
              >
                <Icon size={18} />
              </span>
              <span className="flex-1 text-left tracking-wide">
                {item.label}
              </span>
              {hasChildren && (
                <ChevronDown
                  size={16}
                  className={`text-slate-500 transition-transform duration-300 ${expanded ? "rotate-180 text-sky-300" : ""
                    }`}
                />
              )}
            </>
          );

          return (
            <div key={item.label}>
              {hasChildren ? (
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpenMenu(expanded ? null : item.label)}
                  className={rowClass}
                >
                  {content}
                </button>
              ) : (
                <Link href={item.href} className={rowClass}>
                  {content}
                </Link>
              )}

              {hasChildren && (
                <div
                  inert={!expanded}
                  className={`grid transition-all duration-300 ease-out ${expanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="overflow-hidden">
                    <div className="ml-[1.35rem] mt-1 space-y-0.5 border-l border-white/10 pl-4">
                      {item.children!.map((child) => {
                        const childActive = matchesExact(child.href);
                        return (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors ${childActive
                              ? "bg-white/[0.08] font-medium text-white"
                              : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                              }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full transition-colors ${childActive
                                ? "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]"
                                : "bg-slate-600 group-hover:bg-slate-400"
                                }`}
                            />
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="relative shrink-0 p-4">
        <div className="mb-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl bg-white/[0.04] px-2.5 py-2 text-sm font-medium text-slate-300 ring-1 ring-white/10 transition-all duration-200 hover:bg-gradient-to-r hover:from-rose-500/25 hover:to-orange-500/10 hover:text-white hover:ring-rose-400/40"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-400/15 text-rose-300 transition-colors group-hover:bg-rose-500 group-hover:text-white">
            <LogOut size={18} />
          </span>
          <span className="tracking-wide">Logout</span>
        </button>
      </div>
    </aside>
  );
}