import type { Metadata } from "next";
import PageLayout from "@/components/common/PageLayout";
import { LegalProse } from "@/components/legal/LegalProse";
import { LegalDisclaimer } from "@/components/legal/LegalDisclaimer";
import Link from "next/link";
import { LEGAL_ROUTES } from "@/constants/legalRoutes";
import { COOKIE_CONSENT_STORAGE_KEY } from "@/constants/cookieConsent";

export const metadata: Metadata = {
  title: "Cookie tájékoztató | HRU Referees",
  description: "Cookie tájékoztató – HRU Referees",
};

export default function CookieSzabalyzatPage() {
  return (
    <PageLayout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Cookie tájékoztató
      </h1>
      <LegalProse>
        <LegalDisclaimer />

        <h2>1. Mi az a cookie?</h2>
        <p>
          A <strong>cookie</strong> (süti) egy kis méretű szöveges fájl, amelyet
          a weboldal a böngészőn keresztül helyez el a készülékeden. A sütik
          gyakran munkamenet-azonosításra, beállítások megőrzésére vagy – ha ehhez
          hozzájárulsz – statisztikai célokra szolgálnak.
        </p>

        <h2>2. Milyen technológiákat használunk?</h2>

        <h3>2.1. Szükséges / funkcionális (bejelentkezés)</h3>
        <p>
          A HRU Referees alkalmazás bejelentkezését a <strong>Clerk</strong>{" "}
          szolgáltatás biztosítja. A működéshez tipikusan szükségesek olyan
          technikai tárolók (beleértve a munkamenethez kötődő sütiket), amelyek
          nélkül a biztonságos belépés és a fiókhasználat nem vagy csak korlátozottan
          lenne lehetséges. Ezek használata a szolgáltatás nyújtásához kapcsolódik.
        </p>

        <h3>2.2. Opcionális analitika (Vercel Analytics)</h3>
        <p>
          A webes <strong>látogatottság méréséhez</strong> a{" "}
          <strong>Vercel Analytics</strong> eszköz töltődhet be. Ez nem személyre
          szabott marketingcélú követésre szolgál; a forgalom összesített
          jellegű statisztikája. <strong>Csak akkor aktiváljuk</strong>, ha az
          oldal alján megjelenő sávban ehhez kifejezetten hozzájárulsz („Elfogadom
          (analitika is)”). Ha a „Csak szükséges” opciót választod, az analitika
          nem töltődik be.
        </p>

        <h3>2.3. Helyi tároló (localStorage) – cookie-hozzájárulás</h3>
        <p>
          A választásodat (szükséges-only vs. analitika engedélyezve) a böngésző{" "}
          <strong>localStorage</strong> tárolójában rögzítjük, hogy következő
          látogatáskor ne kérjük újra feleslegesen. A kulcs neve:{" "}
          <code className="rounded bg-gray-100 px-1 font-mono text-[0.8rem]">
            {COOKIE_CONSENT_STORAGE_KEY}
          </code>
          . Ez a technikai beállítás önmagában nem személyes adat; célja kizárólag
          a preferenciád megjegyzése.
        </p>

        <h2>3. Harmadik felek</h2>
        <p>
          A Clerk és a Vercel (analitika esetén) adatkezeléséről részletesebben
          az{" "}
          <Link
            href={LEGAL_ROUTES.privacy}
            className="text-indigo-600 underline">
            adatkezelési tájékoztatóban
          </Link>{" "}
          és az ott linkelt szolgáltatói tájékoztatókban olvashatsz.
        </p>

        <h2>4. Beállításaid módosítása</h2>
        <p>
          A láblécben a <strong>„Cookie beállítások”</strong> linkre kattintva
          bármikor újra megnyithatod a sávot, és módosíthatod a döntésedet. A
          böngésződben a sütiket és a localStorage tartalmát is törölheted; ez
          esetben a következő látogatáskor ismét megkérdezhetjük a preferenciádat.
        </p>

        <h2>5. További információ</h2>
        <p>
          Személyes adatok kezelése:{" "}
          <Link
            href={LEGAL_ROUTES.privacy}
            className="text-indigo-600 underline">
            Adatkezelési tájékoztató
          </Link>
          . Általános szerződési feltételek:{" "}
          <Link
            href={LEGAL_ROUTES.terms}
            className="text-indigo-600 underline">
            ÁSZF
          </Link>
          .
        </p>
      </LegalProse>
    </PageLayout>
  );
}
