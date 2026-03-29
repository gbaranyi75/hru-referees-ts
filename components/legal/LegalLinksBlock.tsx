"use client";

import Link from "next/link";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { LEGAL_ROUTES } from "@/constants/legalRoutes";

const defaultLinkClass =
  "text-indigo-700 underline underline-offset-2 hover:text-indigo-900";

export type LegalLinksBlockProps = {
  /** A <nav> wrapper osztályai */
  className?: string;
  linkClassName?: string;
  /** Lábléc-szerű pont elválasztók a linkek között */
  showSeparators?: boolean;
  /** Mobil menü bezárása stb., miután megnyílt a cookie-sáv */
  onCookieSettingsOpened?: () => void;
  /** Linkekre kattintáskor (pl. mobil menü bezárása) */
  onNavigate?: () => void;
};

export function LegalLinksBlock({
  className = "mb-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs",
  linkClassName = defaultLinkClass,
  showSeparators = true,
  onCookieSettingsOpened,
  onNavigate,
}: LegalLinksBlockProps) {
  const { openCookieSettings } = useCookieConsent();

  const handleCookieSettings = () => {
    openCookieSettings();
    onCookieSettingsOpened?.();
  };

  const sep = showSeparators ? (
    <span
      className="text-indigo-400"
      aria-hidden>
      ·
    </span>
  ) : null;

  return (
    <nav
      aria-label="Jogi információk"
      className={className}>
      <Link
        href={LEGAL_ROUTES.privacy}
        className={linkClassName}
        onClick={onNavigate}>
        Adatkezelés
      </Link>
      {sep}
      <Link
        href={LEGAL_ROUTES.terms}
        className={linkClassName}
        onClick={onNavigate}>
        ÁSZF
      </Link>
      {sep}
      <Link
        href={LEGAL_ROUTES.cookies}
        className={linkClassName}
        onClick={onNavigate}>
        Cookie tájékoztató
      </Link>
      {sep}
      <button
        type="button"
        onClick={handleCookieSettings}
        className={`${linkClassName} cursor-pointer bg-transparent p-0 font-inherit ${showSeparators ? "" : "text-left"}`}>
        Cookie beállítások
      </button>
    </nav>
  );
}
