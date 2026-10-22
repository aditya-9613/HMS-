"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  UserCog,
  Pill,
  Boxes,
  ShieldCheck,
  Wallet,
  CalendarDays,
  ClipboardList,
  Settings,
  Cross,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

type SubItem = { label: string; href: string };

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: SubItem[];
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  {
    label: "Patients",
    href: "/admin/patients",
    icon: Users,
    children: [
      { label: "All Patients", href: "/admin/patients" },
      { label: "Add Patient", href: "/admin/patients/new" },
      { label: "Admissions", href: "/admin/patients/admissions" },
    ],
  },
  { label: "Medical Reports", href: "/admin/medical-reports", icon: FileText },
  {
    label: "Staff",
    href: "/admin/staff",
    icon: UserCog,
    children: [
      { label: "All Staff", href: "/admin/staff" },
      { label: "Add Staff", href: "/admin/staff/new" },
      { label: "Shifts", href: "/admin/staff/shifts" },
    ],
  },
  { label: "Pharmacy", href: "/admin/pharmacy", icon: Pill },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Boxes,
    children: [
      { label: "Medicines", href: "/admin/inventory/medicines" },
      { label: "Equipment", href: "/admin/inventory/equipment" },
    ],
  },
  { label: "Insurance", href: "/admin/insurance", icon: ShieldCheck },
  {
    label: "Finance",
    href: "/admin/finance",
    icon: Wallet,
    children: [
      { label: "Revenue", href: "/admin/finance/revenue" },
      { label: "Expenses", href: "/admin/finance/expenses" },
      { label: "Bills", href: "/admin/finance/bills" },
    ],
  },
  {
    label: "Appointment",
    href: "/admin/appointments",
    icon: CalendarDays,
    children: [
      { label: "All Appointments", href: "/admin/appointments" },
      { label: "Schedule", href: "/admin/appointments/schedule" },
    ],
  },
  { label: "Duties", href: "/admin/duties", icon: ClipboardList },
  { label: "Admin", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-[#0f2742] text-slate-200">
      {/* Logo */}
      <div className="flex h-20 items-center px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-400/60 text-sky-400">
          <Cross size={22} strokeWidth={2.5} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const hasChildren = !!item.children?.length;
          const expanded = openMenu === item.label;

          const baseClass =
            "flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-medium tracking-wide transition-colors";
          const stateClass = active
            ? "bg-[#1d3a5c] text-white"
            : "text-slate-300 hover:bg-[#1a3350] hover:text-white";

          return (
            <div key={item.label}>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => setOpenMenu(expanded ? null : item.label)}
                  className={`${baseClass} ${stateClass} justify-between`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} />
                    <span className="uppercase">{item.label}</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      expanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link href={item.href} className={`${baseClass} ${stateClass}`}>
                  <Icon size={18} />
                  <span className="uppercase">{item.label}</span>
                </Link>
              )}

              {hasChildren && expanded && (
                <div className="ml-6 mt-1 space-y-1 border-l border-slate-600/50 pl-3">
                  {item.children!.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                        pathname === child.href
                          ? "bg-[#1d3a5c] text-white"
                          : "text-slate-400 hover:bg-[#1a3350] hover:text-white"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}