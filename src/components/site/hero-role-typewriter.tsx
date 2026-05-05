"use client";

import { useEffect, useState } from "react";

const defaultRoles = [
  "white-label CMS",
  "visual page builder",
  "CRM workspace",
  "commerce console",
];

export function HeroRoleTypewriter({ roles = defaultRoles }: { roles?: string[] }) {
  const safeRoles = roles.length > 0 ? roles : defaultRoles;
  const [roleIndex, setRoleIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(safeRoles[0].length);
  const [isDeleting, setIsDeleting] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const currentRole = safeRoles[roleIndex] ?? safeRoles[0];
    const pause = characterCount === currentRole.length && !isDeleting ? 1500 : characterCount === 0 ? 320 : 52;
    const speed = isDeleting ? 34 : pause;

    const timeout = window.setTimeout(() => {
      if (isDeleting) {
        if (characterCount === 0) {
          setIsDeleting(false);
          setRoleIndex((current) => (current + 1) % safeRoles.length);
          return;
        }

        setCharacterCount((current) => current - 1);
        return;
      }

      if (characterCount === currentRole.length) {
        setIsDeleting(true);
        return;
      }

      setCharacterCount((current) => current + 1);
    }, speed);

    return () => window.clearTimeout(timeout);
  }, [characterCount, isDeleting, roleIndex, safeRoles]);

  const visibleRole = (safeRoles[roleIndex] ?? safeRoles[0]).slice(0, characterCount);

  return (
    <span className="title-prefix title-typewriter" aria-label="Bespoke CMS roles">
      <span>{visibleRole || "\u00a0"}</span>
      <span className="typewriter-cursor" aria-hidden="true" />
    </span>
  );
}
