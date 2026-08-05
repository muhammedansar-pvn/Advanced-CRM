"use client";

import { Bell, Menu, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      {/* Left: menu button + search */}
      <div className="flex flex-1 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg border lg:hidden hover:bg-accent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open navigation menu"
          aria-expanded={false}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative w-full max-w-sm hidden sm:block">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search CRM…"
            className="h-9 w-full rounded-lg border bg-muted/40 pl-9 pr-12 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-150"
            disabled
            aria-label="Global search (coming soon)"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: theme toggle + notifications + user */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="View notifications (1 unread)"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span
            className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-destructive ring-2 ring-background"
            aria-hidden="true"
          />
        </button>

        <div className="h-6 w-px bg-border hidden sm:block" aria-hidden="true" />

        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="User menu: John Doe, Administrator"
        >
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold leading-tight">John Doe</p>
            <p className="text-[10px] text-muted-foreground">Administrator</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-primary/10 text-primary font-bold shadow-inner transition-all duration-150 group-hover:ring-2 group-hover:ring-primary/20">
            <User className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
      </div>
    </header>
  );
}
