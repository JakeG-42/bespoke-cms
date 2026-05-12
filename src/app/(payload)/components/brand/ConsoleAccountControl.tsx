"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, type KeyboardEvent, type MouseEvent } from "react";
import { useAuth, useTheme } from "@payloadcms/ui";

type ConsoleUserSummary = {
  email?: string | null;
  name?: string | null;
  role?: string | null;
};

type PayloadThemeMode = "auto" | "dark" | "light";

const themeOptions = [
  {
    Icon: Sun,
    label: "Light",
    value: "light",
  },
  {
    Icon: Moon,
    label: "Dark",
    value: "dark",
  },
  {
    Icon: Monitor,
    label: "Automatic",
    value: "auto",
  },
] satisfies Array<{
  Icon: typeof Sun;
  label: string;
  value: PayloadThemeMode;
}>;

function getFirstName(user: unknown) {
  if (!user || typeof user !== "object") {
    return "there";
  }

  const { email, name } = user as ConsoleUserSummary;
  const displayName = name?.trim() || email?.split("@")[0]?.trim();

  return displayName?.split(/\s+/)[0] || "there";
}

export function ConsoleAccountControl() {
  const { user } = useAuth();
  const { autoMode, setTheme, theme } = useTheme();
  const activeTheme = autoMode ? "auto" : theme;

  useEffect(() => {
    const role = typeof user === "object" && user !== null && (user as ConsoleUserSummary).role === "admin" ? "admin" : "non-admin";

    document.documentElement.dataset.consoleRole = role;

    return () => {
      delete document.documentElement.dataset.consoleRole;
    };
  }, [user]);

  const setPayloadTheme = (mode: PayloadThemeMode) => {
    (setTheme as (theme: PayloadThemeMode) => void)(mode);
  };

  const handleThemeSelect = (event: MouseEvent<HTMLSpanElement>, mode: PayloadThemeMode) => {
    event.preventDefault();
    event.stopPropagation();
    setPayloadTheme(mode);
  };

  const handleThemeKeyDown = (event: KeyboardEvent<HTMLSpanElement>, mode: PayloadThemeMode) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setPayloadTheme(mode);
  };

  return (
    <span className="console-account-control">
      <span className="console-account-greeting">Welcome {getFirstName(user)}</span>
      <span aria-label="Admin theme" className="console-theme-switcher" role="group">
        {themeOptions.map(({ Icon, label, value }) => (
          <span
            aria-label={`${label} theme`}
            aria-pressed={activeTheme === value}
            className={`console-theme-option${activeTheme === value ? " active" : ""}`}
            key={value}
            onClick={(event) => handleThemeSelect(event, value)}
            onKeyDown={(event) => handleThemeKeyDown(event, value)}
            role="button"
            tabIndex={0}
            title={`${label} theme`}
          >
            <Icon aria-hidden="true" size={15} strokeWidth={2.35} />
          </span>
        ))}
      </span>
    </span>
  );
}
