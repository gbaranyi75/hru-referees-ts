/** localStorage key for cookie / analytics preference */
export const COOKIE_CONSENT_STORAGE_KEY = "hru_cookie_consent_v1";

export type CookieConsentStored = {
  version: 1;
  /** Ha true, engedélyezett a Vercel Analytics (nem szükséges cookie) */
  analytics: boolean;
};
