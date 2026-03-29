"use client";

import Link from "next/link";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { LEGAL_ROUTES } from "@/constants/legalRoutes";

export function CookieConsentBanner() {
  const { consent, setConsent, closeCookieSettings, settingsOpen } =
    useCookieConsent();

  const visible = consent === null || settingsOpen;
  if (!visible) return null;

  /** Csak ha már van tárolt döntés (nem hydration, nem első kérdés) */
  const isSettings = settingsOpen && consent != null;

  return (
    <div
      role="region"
      aria-labelledby="cookie-banner-title"
      className="fixed bottom-0 left-0 right-0 z-[100000] border-t border-indigo-200 bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:p-5">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="text-sm text-gray-700">
          <h2
            id="cookie-banner-title"
            className="mb-1 font-semibold text-gray-900">
            {isSettings ? "Cookie beállítások" : "Sütik és mérés"}
          </h2>
          <p>
            A működéshez szükséges (pl. bejelentkezés) sütik mellett opcionálisan
            használhatunk{" "}
            <strong className="font-medium">Vercel Analytics</strong> forgalom
            mérésre. Részletek:{" "}
            <Link
              href={LEGAL_ROUTES.cookies}
              className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800">
              cookie tájékoztató
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          {isSettings && (
            <button
              type="button"
              onClick={closeCookieSettings}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">
              Bezárás
            </button>
          )}
          <button
            type="button"
            onClick={() => setConsent(false)}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-100">
            Csak szükséges
          </button>
          <button
            type="button"
            onClick={() => setConsent(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Elfogadom (analitika is)
          </button>
        </div>
      </div>
    </div>
  );
}
