/**
 * IT szolgáltatók / adatfeldolgozók – a HRU Referees kódban használt integrációk alapján.
 * Linkek a szolgáltatók saját adatvédelmi oldalaira (tájékoztató jelleggel).
 */
export const DATA_PROCESSORS = [
  {
    name: "Clerk Inc.",
    role:
      "Felhasználói hitelesítés, munkamenet-kezelés, bejelentkezési felület; a felhasználói fiók azonosítója (clerkUserId) összekapcsolása az alkalmazás adatbázisával.",
    privacy: "https://clerk.com/legal/privacy",
  },
  {
    name: "Vercel Inc.",
    role:
      "A Next.js alkalmazás üzemeltetése (hosting); opcionálisan webes forgalom-statisztika (Vercel Analytics), ha ehhez a látogató a cookie-sávban hozzájárul.",
    privacy: "https://vercel.com/legal/privacy-policy",
  },
  {
    name: "MongoDB Atlas",
    role:
      "Felhasználói profilok, mérkőzés- és egyéb üzleti adatok tárolása MongoDB adatbázisban (üzemeltető által megadott régió / szerződés szerint).",
    privacy: "https://www.mongodb.com/legal/privacy-policy",
  },
  {
    name: "Cloudflare (R2)",
    role:
      "Objektumtár (R2): dokumentumok és fájlok feltöltése, tárolása, letöltése az alkalmazáson keresztül.",
    privacy: "https://www.cloudflare.com/privacypolicy/",
  },
  {
    name: "Cloudinary",
    role:
      "Profil- és médiafeltöltéshez kapcsolódó képfeldolgozás / CDN (a felületen megadott feltöltési beállítások szerint).",
    privacy: "https://cloudinary.com/privacy",
  },
  {
    name: "Resend",
    role:
      "Tranzakciós e-mailek kézbesítése (pl. játékvezetői értesítések, kapcsolatfelvételi üzenet továbbítása); küldő cím az alkalmazás konfigurációja szerint.",
    privacy: "https://resend.com/legal/privacy-policy",
  },
  {
    name: "GeoNames",
    role:
      "Helyszín-/településnév keresés támogatása külső API hívással (a keresett szöveg átadódhat a szolgáltatónak a találatok visszaadásához).",
    privacy: "https://www.geonames.org/",
  },
] as const;
