"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Handshake,
  CheckSquare,
  BarChart3,
  Settings,
  X,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const sidebarItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Deals", href: "/deals", icon: Handshake },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card text-card-foreground transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >

        <div className="flex h-16 items-center justify-between px-6 border-b">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl tracking-tight">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20">
              <Sparkles className="h-5 w-5 animate-pulse text-yellow-400" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
              ApexCRM
            </span>
          </Link>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border lg:hidden hover:bg-accent"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.name}</span>
                {isActive && (
                  <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary-foreground animate-ping" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center space-x-3 rounded-lg p-2 hover:bg-accent cursor-pointer transition-colors duration-200">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
              JD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold truncate">John Doe</p>
              <p className="text-[10px] text-muted-foreground truncate">john.doe@apexcrm.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
