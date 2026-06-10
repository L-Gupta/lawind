"use client";

import { cn } from "@/lib/utils";
import {
  BookOpen,
  FileText,
  FolderOpen,
  Scale,
  Shield,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  comingSoon?: boolean;
}

const navItems: NavItem[] = [
  { label: "Research", icon: BookOpen, active: true },
  { label: "Drafting", icon: FileText, comingSoon: true },
  { label: "Contract Review", icon: Shield, comingSoon: true },
  { label: "Matters", icon: FolderOpen, comingSoon: true },
  { label: "Compliance", icon: Scale, comingSoon: true },
];

export function SidebarNav() {
  return (
    <nav className="flex flex-col gap-1 p-3">
      <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Platform
      </p>
      {navItems.map((item) => (
        <button
          key={item.label}
          type="button"
          disabled={item.comingSoon}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            item.active
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-muted-foreground",
            item.comingSoon
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <item.icon className="size-4 shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {item.comingSoon && (
            <span className="text-[10px] font-normal text-muted-foreground">
              Soon
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}
