"use client";

import { Bell, Menu, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center space-x-4">

        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg border lg:hidden hover:bg-accent focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search CRM..."
            className="h-9 w-full rounded-lg border bg-muted/40 pl-9 pr-12 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center space-x-4">

        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent hover:text-accent-foreground"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
        </button>

        <div className="h-6 w-px bg-border hidden sm:block" />

        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold">John Doe</p>
            <p className="text-[10px] text-muted-foreground">Administrator</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-primary/10 text-primary font-bold shadow-inner">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
