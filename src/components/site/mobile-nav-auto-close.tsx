"use client";

import { useEffect } from "react";

export function MobileNavAutoClose() {
  useEffect(() => {
    const nav = document.querySelector<HTMLDetailsElement>(".mobile-nav");

    if (!nav) {
      return;
    }

    const mobileNav = nav;

    function closeMenu() {
      mobileNav.open = false;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!mobileNav.open || !(event.target instanceof Node) || mobileNav.contains(event.target)) {
        return;
      }

      closeMenu();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>("a"));

    links.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      links.forEach((link) => link.removeEventListener("click", closeMenu));
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
