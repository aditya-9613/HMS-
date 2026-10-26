"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "@/Images/logo.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, CalendarDays, FileText, UserCog, Pill, Boxes,
  ShieldCheck, Wallet, ClipboardList, FileSignature, ShoppingCart, Banknote,
  KeyRound, History, UserPlus, Eye, Pencil, BedDouble, LogIn, LogOut,
  CalendarPlus, Stethoscope, CalendarClock, CalendarX, CalendarCheck,
  ArrowRightLeft, FilePlus, Printer, PackageCheck, FlaskConical, Upload,
  LayoutTemplate, FileCog, UserMinus, Landmark, BadgeCheck, PackagePlus,
  Package, HandHelping, ClipboardCheck, AlertTriangle, Wrench, Warehouse,
  Truck, Store, Receipt, CreditCard, Building2, FileWarning, HandCoins,
  ReceiptText, XCircle, TrendingDown, ListOrdered, ArrowLeftRight, BarChart3,
  Settings2, Calculator, Send, RefreshCw, Clock, Timer, UserCheck, Repeat,
  Lock, ScrollText, Filter, ChevronDown
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import axios from "axios";

type SubItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

const HOME_HREF = "#";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: SubItem[];
};

// Add or remove entries here, the sidebar renders whatever is in this array.
const navItems: NavItem[] = [
  { label: "Dashboards", href: "#", icon: LayoutDashboard },
  {
    label: "Patients",
    href: "#",
    icon: Users,
    children: [
      { label: "New Patient", href: "#", icon: UserPlus },
      { label: "View Patient", href: "#", icon: Eye },
      { label: "Edit Patient", href: "#", icon: Pencil },
      { label: "Patient History", href: "#", icon: History },
      { label: "IPD Patients", href: "#", icon: BedDouble },
      { label: "Admit Patient", href: "#", icon: LogIn },
      { label: "Discharge Patient", href: "#", icon: LogOut },
    ],
  },
  {
    label: "Appointments",
    href: "#",
    icon: CalendarDays,
    children: [
      { label: "Book Appointment", href: "#", icon: CalendarPlus },
      { label: "Assign Doctor", href: "#", icon: Stethoscope },
      { label: "View Appointment", href: "#", icon: Eye },
      { label: "Reschedule Appointment", href: "#", icon: CalendarClock },
      { label: "Cancel Appointment", href: "#", icon: CalendarX },
      { label: "Mark No Show / Completed", href: "#", icon: CalendarCheck },
      { label: "View IPD Status", href: "#", icon: BedDouble },
      { label: "Transfer IPD", href: "#", icon: ArrowRightLeft },
    ],
  },
  {
    label: "Prescriptions",
    href: "#",
    icon: FileSignature,
    children: [
      { label: "Create Prescription", href: "#", icon: FilePlus },
      { label: "View Prescription", href: "#", icon: Eye },
      { label: "Print Prescription", href: "#", icon: Printer },
      { label: "Dispense Status", href: "#", icon: PackageCheck },
    ],
  },
  {
    label: "Medical Reports",
    href: "#",
    icon: FileText,
    children: [
      { label: "Assign Test", href: "#", icon: FlaskConical },
      { label: "Create Report", href: "#", icon: FilePlus },
      { label: "View Report", href: "#", icon: Eye },
      { label: "Edit Report", href: "#", icon: Pencil },
      { label: "Upload Report Images", href: "#", icon: Upload },
      { label: "Create Report Template", href: "#", icon: LayoutTemplate },
      { label: "View / Edit Report Templates", href: "#", icon: FileCog },
    ],
  },
  {
    label: "Staff",
    href: "#",
    icon: UserCog,
    children: [
      { label: "Add Staff", href: "#", icon: UserPlus },
      { label: "View Staff", href: "#", icon: Users },
      { label: "Edit Staff", href: "#", icon: Pencil },
      { label: "Resign / Terminate Staff", href: "#", icon: UserMinus },
      { label: "Add Bank Account", href: "#", icon: Landmark },
      { label: "Verify Bank Account", href: "#", icon: BadgeCheck },
    ],
  },
  {
    label: "Pharmacy",
    href: "#",
    icon: Pill,
    children: [
      { label: "Add Medicine", href: "#", icon: Pill },
      { label: "View / Edit Medicines", href: "#", icon: Pencil },
      { label: "Create Stocks", href: "#", icon: PackagePlus },
      { label: "View Stocks", href: "#", icon: Package },
      { label: "Dispense Medicine", href: "#", icon: HandHelping },
      { label: "View Dispense", href: "#", icon: ClipboardCheck },
      { label: "Expiry & Low Stock Report", href: "#", icon: AlertTriangle },
    ],
  },
  {
    label: "Inventory",
    href: "#",
    icon: Boxes,
    children: [
      { label: "Add Item", href: "#", icon: PackagePlus },
      { label: "View / Edit Items", href: "#", icon: Package },
      { label: "Equipments", href: "#", icon: Wrench },
      { label: "Add Stock", href: "#", icon: Warehouse },
      { label: "View Stock", href: "#", icon: Boxes },
      { label: "Add Supplier", href: "#", icon: Truck },
      { label: "View / Edit Suppliers", href: "#", icon: Store },
    ],
  },
  {
    label: "Purchases",
    href: "#",
    icon: ShoppingCart,
    children: [
      { label: "Create Purchase", href: "#", icon: ShoppingCart },
      { label: "View Purchases", href: "#", icon: Receipt },
      { label: "Record Supplier Payment", href: "#", icon: CreditCard },
    ],
  },
  {
    label: "Insurance",
    href: "#",
    icon: ShieldCheck,
    children: [
      { label: "Add Provider", href: "#", icon: Building2 },
      { label: "View / Edit Providers", href: "#", icon: Pencil },
      { label: "Add Policy", href: "#", icon: FilePlus },
      { label: "Accept / Reject Policy", href: "#", icon: BadgeCheck },
      { label: "Raise Claim", href: "#", icon: FileWarning },
      { label: "View Claims", href: "#", icon: Eye },
      { label: "Claim Settlement", href: "#", icon: HandCoins },
    ],
  },
  {
    label: "Finance",
    href: "#",
    icon: Wallet,
    children: [
      { label: "Create OPD Bill", href: "#", icon: Receipt },
      { label: "Create IPD Bill", href: "#", icon: ReceiptText },
      { label: "View Bills", href: "#", icon: Eye },
      { label: "Record Payment", href: "#", icon: CreditCard },
      { label: "Cancel Bill", href: "#", icon: XCircle },
      { label: "Add Expense", href: "#", icon: TrendingDown },
      { label: "View Expenses", href: "#", icon: ListOrdered },
      { label: "Transactions", href: "#", icon: ArrowLeftRight },
      { label: "Doctor Earnings", href: "#", icon: Stethoscope },
      { label: "Financial Reports", href: "#", icon: BarChart3 },
    ],
  },
  {
    label: "Payroll",
    href: "#",
    icon: Banknote,
    children: [
      { label: "Create Salary Structure", href: "#", icon: FilePlus },
      { label: "View / Edit Salary Structures", href: "#", icon: Settings2 },
      { label: "Prepare Payroll Run", href: "#", icon: Calculator },
      { label: "Approve Payroll Run", href: "#", icon: BadgeCheck },
      { label: "Initiate Payout", href: "#", icon: Send },
      { label: "View Payslip", href: "#", icon: FileText },
      { label: "Retry Failed Payouts", href: "#", icon: RefreshCw },
      { label: "Payroll Reports", href: "#", icon: BarChart3 },
    ],
  },
  {
    label: "Duties",
    href: "#",
    icon: ClipboardList,
    children: [
      { label: "Create Shift", href: "#", icon: Clock },
      { label: "View / Edit Shifts", href: "#", icon: Timer },
      { label: "Duty Roster", href: "#", icon: CalendarDays },
      { label: "Assign Duties", href: "#", icon: UserCheck },
      { label: "Check Duties", href: "#", icon: ClipboardCheck },
      { label: "Swap / Replace Duty", href: "#", icon: Repeat },
      { label: "Check-in / Check-out", href: "#", icon: LogIn },
    ],
  },
  {
    label: "Users & Access",
    href: "#",
    icon: KeyRound,
    children: [
      { label: "Add User", href: "#", icon: UserPlus },
      { label: "View Users", href: "#", icon: Users },
      { label: "Assign Role", href: "#", icon: ShieldCheck },
      { label: "Reset Password", href: "#", icon: KeyRound },
      { label: "Lock / Suspend User", href: "#", icon: Lock },
    ],
  },
  {
    label: "Activity Logs",
    href: "#",
    icon: History,
    children: [
      { label: "View Logs", href: "#", icon: ScrollText },
      { label: "Filter by User / Module / Date", href: "#", icon: Filter },
    ],
  },
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

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const matches = (href: string) =>
    href !== "#" && (pathname === href || pathname.startsWith(href + "/"));

  const isItemActive = (item: NavItem) =>
    matches(item.href) || !!item.children?.some((c) => matches(c.href));

  const [openMenu, setOpenMenu] = useState<string | null>(
    () =>
      navItems.find((i) => i.children?.length && isItemActive(i))?.label ??
      null
  );

  const handleLogout = async () => {
    const res = await axios.put('/api/auth/logout', {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      withCredentials: true,
      validateStatus: () => true
    })
    if (res.status === 200) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem('role')
      router.replace("/");
    }
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
                        const childActive = matches(child.href);
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors ${childActive
                              ? "bg-white/[0.08] font-medium text-white"
                              : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                              }`}
                          >
                            {ChildIcon ? (
                              <ChildIcon
                                size={15}
                                className={`shrink-0 transition-colors ${childActive ? "text-sky-300" : "text-slate-500"
                                  }`}
                              />
                            ) : (
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${childActive
                                  ? "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]"
                                  : "bg-slate-600"
                                  }`}
                              />
                            )}
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