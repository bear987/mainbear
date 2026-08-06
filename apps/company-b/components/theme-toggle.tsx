"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

/**
 * Ember ⇄ Cream switch. The actual theme is set on <html data-theme> before
 * paint by the no-flash script in layout; this button just reads it, flips it,
 * and remembers the choice. Icon shows the mode you'll switch TO.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = document.documentElement.dataset.theme;
    if (current === "light" || current === "dark") setTheme(current);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode / storage disabled — session-only, no persistence */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        mounted
          ? `Switch to ${theme === "dark" ? "light" : "dark"} mode`
          : "Toggle colour theme"
      }
      title="Toggle theme"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-heading transition-colors duration-200 hover:bg-surface"
    >
      {theme === "dark" ? (
        <Sun size={18} aria-hidden />
      ) : (
        <Moon size={17} aria-hidden />
      )}
    </button>
  );
}
