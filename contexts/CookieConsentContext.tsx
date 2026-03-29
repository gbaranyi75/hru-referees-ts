"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  type CookieConsentStored,
} from "@/constants/cookieConsent";

type CookieConsentContextValue = {
  /**
   * undefined = tároló még nem olvasott (hydration előtt; ne mutass banner „üres” állapotot)
   * null = nincs érvényes tárolt választás → első látogatás / döntés szükséges
   */
  consent: CookieConsentStored | null | undefined;
  setConsent: (analytics: boolean) => void;
  /** Cookie banner megnyitása (beállítások) */
  openCookieSettings: () => void;
  closeCookieSettings: () => void;
  settingsOpen: boolean;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

function readStored(): CookieConsentStored | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentStored;
    if (parsed?.version !== 1 || typeof parsed.analytics !== "boolean") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [consent, setConsentState] = useState<
    CookieConsentStored | null | undefined
  >(undefined);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setConsentState(readStored());
  }, []);

  const setConsent = useCallback((analytics: boolean) => {
    const next: CookieConsentStored = { version: 1, analytics };
    try {
      localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Letiltott tároló, kvóta, privát mód stb. — a választás így is érvényes marad a munkamenetben
    }
    setConsentState(next);
    setSettingsOpen(false);
  }, []);

  const openCookieSettings = useCallback(() => setSettingsOpen(true), []);
  const closeCookieSettings = useCallback(() => setSettingsOpen(false), []);

  const value = useMemo(
    () => ({
      consent,
      setConsent,
      openCookieSettings,
      closeCookieSettings,
      settingsOpen,
    }),
    [consent, setConsent, openCookieSettings, closeCookieSettings, settingsOpen]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
}
