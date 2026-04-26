"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Boxes,
  ExternalLink,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  Sun,
} from "lucide-react";

import { logoutAction } from "@/app/studio/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/studio", label: "Dashboard", icon: LayoutDashboard },
  { href: "/studio/products", label: "Products", icon: Boxes },
  { href: "/studio/submissions", label: "Enquiries", icon: Inbox },
  { href: "/studio/settings", label: "Settings", icon: Settings },
];

export function StudioShell({
  children,
  storageConfigured,
  storageMode,
}: {
  children: React.ReactNode;
  storageConfigured: boolean;
  storageMode: string;
}) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = window.localStorage.getItem("eltronic-studio-theme");

      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
    }

    return "dark";
  });

  useEffect(() => {
    window.localStorage.setItem("eltronic-studio-theme", theme);
  }, [theme]);

  return (
    <div className="studio-app" data-theme={theme} suppressHydrationWarning>
      <aside className="studio-sidebar">
        <Link className="studio-brand" href="/studio">
          <span className="studio-brand-mark">E</span>
          <span>
            <strong>Eltronic</strong>
            <small>Studio</small>
          </span>
        </Link>

        <nav className="studio-nav" aria-label="Studio navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/studio" ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link className={cn("studio-nav-link", active && "active")} href={item.href} key={item.href}>
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="studio-sidebar-footer">
          <Button asChild className="w-full justify-start" variant="ghost">
            <Link href="/">
              <Home className="size-4" />
              Public site
            </Link>
          </Button>
          <form action={logoutAction}>
            <Button className="w-full justify-start" type="submit" variant="ghost">
              <LogOut className="size-4" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      <div className="studio-workspace">
        <header className="studio-topbar">
          <div>
            <p className="studio-eyebrow">Admin portal</p>
            <strong>{currentModeLabel(pathname)}</strong>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!storageConfigured ? (
              <span className="rounded-full border border-amber-300/35 bg-amber-300/12 px-3 py-1 text-xs font-bold text-amber-200">
                {storageMode}
              </span>
            ) : null}
            <Button asChild size="sm" variant="outline">
              <Link href="/" target="_blank">
                <ExternalLink className="size-4" />
                View site
              </Link>
            </Button>
            <Button
              aria-label="Toggle Studio theme"
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              size="sm"
              type="button"
              variant="outline"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {theme === "dark" ? "Light" : "Dark"}
            </Button>
          </div>
        </header>
        {!storageConfigured ? (
          <div className="studio-storage-alert">
            Storage is currently <strong>{storageMode}</strong>. Local edits work here, but Vercel needs
            <code> KV_REST_API_URL </code> and <code>KV_REST_API_TOKEN</code> before live admin writes are persistent.
          </div>
        ) : null}
        <main className="studio-content">{children}</main>
      </div>
    </div>
  );
}

function currentModeLabel(pathname: string) {
  if (pathname.startsWith("/studio/products")) return "Products";
  if (pathname.startsWith("/studio/submissions")) return "Enquiries";
  if (pathname.startsWith("/studio/settings")) return "Settings";

  return "Dashboard";
}
