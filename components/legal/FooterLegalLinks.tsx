"use client";

import Link from "next/link";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { LEGAL_ROUTES } from "@/constants/legalRoutes";

const linkClass =
  "text-indigo-700 underline underline-offset-2 hover:text-indigo-900";

export function FooterLegalLinks() {
  const { openCookieSettings } = useCookieConsent();

  return (
    <nav
      aria-label="Jogi információk"
      className="mb-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs">
      <Link
        href={LEGAL_ROUTES.privacy}
        className={linkClass}>
        Adatkezelés
      </Link>
      <span className="text-indigo-400" aria-hidden>
        ·
      </span>
      <Link
        href={LEGAL_ROUTES.terms}
        className={linkClass}>
        ÁSZF
      </Link>
      <span className="text-indigo-400" aria-hidden>
        ·
      </span>
      <Link
        href={LEGAL_ROUTES.cookies}
        className={linkClass}>
        Cookie tájékoztató
      </Link>
      <span className="text-indigo-400" aria-hidden>
        ·
      </span>
      <button
        type="button"
        onClick={openCookieSettings}
        className={`${linkClass} cursor-pointer bg-transparent p-0 font-inherit`}>
        Cookie beállítások
      </button>
    </nav>
  );
}
