"use client";

import { Analytics } from "@vercel/analytics/next";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

export function ConditionalAnalytics() {
  const { consent } = useCookieConsent();
  if (consent?.analytics !== true) return null;
  return <Analytics />;
}
