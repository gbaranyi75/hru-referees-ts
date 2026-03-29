"use client";

import {
  Analytics,
  type BeforeSendEvent,
} from "@vercel/analytics/next";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { useCallback, useEffect, useRef } from "react";

/**
 * Vercel Analytics script a DOM-ban maradhat unmount után is; ha a felhasználó
 * ugyanabban a munkamenetben visszavonja az engedélyt, a beforeSend null-lal
 * tiltja a további pageview / event küldést (azonnal).
 */
export function ConditionalAnalytics() {
  const { consent } = useCookieConsent();
  /** Volt már analytics engedély ebben a munkamenetben → script már betöltődhetett */
  const everHadAnalyticsRef = useRef(false);

  useEffect(() => {
    if (consent?.analytics === true) {
      everHadAnalyticsRef.current = true;
    }
  }, [consent?.analytics]);

  const beforeSend = useCallback(
    (event: BeforeSendEvent) => {
      if (consent?.analytics !== true) return null;
      return event;
    },
    [consent?.analytics],
  );

  const shouldMount =
    consent !== undefined &&
    consent !== null &&
    (consent.analytics === true || everHadAnalyticsRef.current);

  if (!shouldMount) return null;

  return <Analytics beforeSend={beforeSend} />;
}
