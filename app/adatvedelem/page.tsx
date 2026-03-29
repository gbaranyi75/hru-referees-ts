import type { Metadata } from "next";
import PageLayout from "@/components/common/PageLayout";
import { LegalProse } from "@/components/legal/LegalProse";
import { LegalDisclaimer } from "@/components/legal/LegalDisclaimer";
import Link from "next/link";
import { LEGAL_ROUTES } from "@/constants/legalRoutes";
import { DATA_PROCESSORS } from "@/constants/dataProcessors";
import { ORG_CONTACT, RESEND_FROM_DISPLAY } from "@/constants/contact";
import { COOKIE_CONSENT_STORAGE_KEY } from "@/constants/cookieConsent";

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató | HRU Referees",
  description: "Adatkezelési tájékoztató – HRU Referees",
};

export default function AdatvedelemPage() {
  return (
    <PageLayout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Adatkezelési tájékoztató
      </h1>
      <LegalProse>
        <LegalDisclaimer />

        <h2>1. Az adatkezelő és az alkalmazás</h2>
        <p>
          Jelen tájékoztató a <strong>HRU Referees</strong> elnevezésű webes
          alkalmazásra vonatkozik, amelyet a Magyar Rögbi Szövetség Játékvezetői
          Bizottságának tevékenységéhez kapcsolódóan használnak a játékvezetői
          adminisztráció támogatására (mérkőzések, elérhetőségek, dokumentumok
          stb. – a pontos szolgáltatáskör az alkalmazás aktuális funkcióitól
          függ).
        </p>
        <p>
          <strong>Adatkezelő (kitöltendő):</strong> a személyes adatokért
          felelős szervezet teljes jogi megnevezése, székhelye, cégjegyzékszáma
          (ha van), valamint az adatvédelmi kérelmek intézésére szolgáló e-mail
          címe és postai levelezési címe. Addig is általános megkereséshez
          használható elérhetőség:{" "}
          <a
            href={`mailto:${ORG_CONTACT.email}`}
            className="text-indigo-600 underline">
            {ORG_CONTACT.email}
          </a>
          , telefon: {ORG_CONTACT.phone}.
        </p>

        <h2>2. Milyen adatokat kezelünk?</h2>
        <p>
          Az alábbi felsorolás a rendszer <strong>kódban rögzített</strong>{" "}
          adatköreire támaszkodik; a tényleges kezelés mindig a valós használattól
          és a felhasználói beviteltől függ.
        </p>

        <h3>2.1. Regisztráció és belépés (Clerk)</h3>
        <p>
          A bejelentkezést egy külső szolgáltató (Clerk) biztosítja. A
          munkamenethez és a fiókkezeléshez kapcsolódó azonosítók, valamint a
          Clerk felületén megadott alapadatok a Clerk és az alkalmazás
          üzemeltetője közötti megállapodás szerint kerülnek kezelésre. Az
          alkalmazás saját adatbázisában a felhasználó rekordja összekapcsolódik
          egy <strong>clerkUserId</strong> azonosítóval.
        </p>
        <p>
          A rendszer a Clerk felhasználói metaadataiban kezelheti többek között:
          a fiók <strong>jóváhagyását</strong> (approved) és az{" "}
          <strong>adminisztrátori szerepkört</strong> (role), amely a védett
          adminisztrációs funkciókhoz való hozzáférést szabályozza.
        </p>

        <h3>2.2. Felhasználói profil (alkalmazás adatbázisa)</h3>
        <p>
          A felhasználói profilhoz kapcsolódóan kezelhetők többek között:{" "}
          <strong>e-mail cím</strong>, <strong>felhasználónév</strong>, opcionális
          profilkép URL (<strong>image</strong>), lakhely szerinti{" "}
          <strong>város és ország</strong>, <strong>telefonszám</strong>,{" "}
          <strong>cím / titulus</strong> jellegű megjelölés (<strong>
            hasTitle
          </strong>
          ), <strong>státusz</strong>, valamint opcionális{" "}
          <strong>Facebook / Instagram</strong> profil URL. A rekordokhoz
          technikai <strong>létrehozás / módosítás időbélyegek</strong>{" "}
          kapcsolódhatnak.
        </p>

        <h3>2.3. Mérkőzéshez kapcsolódó adatok</h3>
        <p>
          A mérkőzésrekordok szereplhetnek benne: csapatok megnevezése vagy
          hivatkozása, mérkőzés típusa, nem és korosztály jelölés,{" "}
          <strong>helyszín</strong>, <strong>dátum és időpont</strong>. A
          hivatalosokhoz rendelve tárolhatók a kijelölöttek{" "}
          <strong>felhasználóneve</strong>, <strong>clerkUserId</strong> és{" "}
          <strong>e-mail címe</strong> (játékvezető, segítők, ellenőrök stb. a
          rendszer aktuális mezői szerint). Ezek az adatok a játékvezetői
          ügyvitelhez és – a beállításoktól függően – e-mail értesítésekhez
          szükségesek lehetnek.
        </p>

        <h3>2.4. Vendégfelhasználók</h3>
        <p>
          Korlátozott adatkörrel rögzíthető <strong>vendég</strong> felhasználó
          is (például <strong>felhasználónév</strong>, <strong>ország</strong>,{" "}
          <strong>státusz</strong>), ha az alkalmazás ezt a funkciót használja.
        </p>

        <h3>2.5. Kapcsolatfelvételi űrlap</h3>
        <p>
          A weboldalon elérhető kapcsolatfelvételi űrlapon megadott{" "}
          <strong>név</strong>, <strong>e-mail cím</strong> és{" "}
          <strong>üzenet szövege</strong> a megkeresés megválaszolásához kerül
          feldolgozásra. Technikai védelemként az API oldal{" "}
          <strong>óránként legfeljebb öt</strong> beküldést engedélyez
          IP-címenként (részletek az üzemeltető szerverkonfigurációjában); ehhez
          a kérések számlálása ideiglenesen tárolódhat.
        </p>

        <h3>2.6. E-mail értesítések</h3>
        <p>
          A rendszer tranzakciós jelleggel e-mailt küldhet (például játékvezetői
          értesítés). A küldés a Resend szolgáltatáson keresztül történik; a
          feladó megjelenített címe az alkalmazás beállításai szerint lehet pl.:{" "}
          <strong>{RESEND_FROM_DISPLAY}</strong>.
        </p>

        <h3>2.7. Fájlok és média</h3>
        <p>
          Dokumentumok és fájlok feltöltése és tárolása a{" "}
          <strong>Cloudflare R2</strong> objektumtárban történhet. Profil- vagy
          médiafeltöltésnél <strong>Cloudinary</strong> is igénybe vehető képfeldolgozáshoz
          / megjelenítéshez.
        </p>

        <h3>2.8. Helyszínkeresés</h3>
        <p>
          Település- vagy helyszínkereséshez a rendszer külső{" "}
          <strong>GeoNames</strong> API-t hívhat meg; a keresőkifejezés átadása
          szükséges lehet a találatok visszaadásához.
        </p>

        <h3>2.9. Cookie-hozzájárulás tárolása</h3>
        <p>
          A webes analitika bekapcsolásához szükséges választásodat a böngésző{" "}
          <strong>localStorage</strong> tárolójában rögzítjük a következő kulccsal:{" "}
          <code className="rounded bg-gray-100 px-1">{COOKIE_CONSENT_STORAGE_KEY}</code>
          . Ez nem személyes adat, de a tájékoztatás teljessége miatt itt
          feltüntetjük; részletek a{" "}
          <Link
            href={LEGAL_ROUTES.cookies}
            className="text-indigo-600 underline">
            cookie tájékoztatóban
          </Link>
          .
        </p>

        <h2>3. Adatkezelés célja és jogalapja</h2>
        <p>
          A kezelés célja elsősorban a <strong>szolgáltatás nyújtása</strong>, a
          játékvezetői feladatok adminisztrációja, a hozzáférés szabályozása
          (jóváhagyás, szerepkörök), valamint – ahol releváns –{" "}
          <strong>kapcsolattartás</strong> és <strong>értesítés</strong>. A
          pontos <strong>jogalap</strong> (pl. GDPR 6. cikk szerinti szerződés
          teljesítése, jogos érdek, hozzájárulás, jogi kötelezettség) minden
          adatkörre nézve <strong>szervezeti döntés és jogi felülvizsgálat</strong>{" "}
          tárgya; ezt a táblázatot az adatkezelőnek kell véglegesítenie.
        </p>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-2 font-semibold">Adatkör (röviden)</th>
                <th className="p-2 font-semibold">Tipikus cél</th>
                <th className="p-2 font-semibold">Jogalap (kitöltendő)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-2">Regisztráció, profil, fiók</td>
                <td className="p-2">Szolgáltatás biztosítása, azonosítás</td>
                <td className="p-2">Szerződés / jogos érdek / stb. – kitöltendő</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">Mérkőzés, kijelölések</td>
                <td className="p-2">Sportrendezvény lebonyolítása, értesítés</td>
                <td className="p-2">Szerződés / jogos érdek / stb. – kitöltendő</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">Kapcsolatfelvétel</td>
                <td className="p-2">Megkeresés megválaszolása</td>
                <td className="p-2">Jogos érdek / hozzájárulás – kitöltendő</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-2">Analitika (Vercel)</td>
                <td className="p-2">Látogatottság mérése</td>
                <td className="p-2">Hozzájárulás (cookie-sáv)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>4. Megőrzési idő</h2>
        <p>
          A személyes adatokat addig őrizzük, amíg az a szolgáltatás
          biztosításához szükséges, illetve amíg jogszabály vagy jogos érdek ezt
          indokolja. A konkrét megőrzési idők (pl. inaktív fiókok, lezárt
          szezonok mérkőzésadatai, kapcsolatfelvételi üzenetek){" "}
          <strong>belső adatvédelmi szabályzatban kitöltendők</strong>. A törlés
          vagy anonimizálás módja szintén szervezeti eljárásrendhez kötött.
        </p>

        <h2>5. Az érintettek jogai</h2>
        <p>
          Az Európai Unió adatvédelmi rendelete (GDPR) alapján jogosult vagy
          többek között: <strong>tájékoztatást</strong> kérni,{" "}
          <strong>hozzáférést</strong> kérni, <strong>helyesbítést</strong>{" "}
          kérni, adatkezelés <strong>korlátozását</strong> kérni,{" "}
          <strong>törlést</strong> kérni („elfeledtetéshez való jog”), valamint –
          a feltételek szerint – <strong>adathordozhatóságot</strong> kérni és{" "}
          <strong>tiltakozni</strong> a rád vonatkozó adatkezelés ellen.
        </p>
        <p>
          Panaszt tehetsz a Nemzeti Adatvédelmi és Információszabadság Hatóságnál
          (NAIH:{" "}
          <a
            href="https://www.naih.hu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline">
            naih.hu
          </a>
          ). A jogok gyakorlásának módja (e-mail cím, határidő) –{" "}
          <strong>az adatkezelő eljárásrendje szerint kitöltendő</strong>; addig
          is használható az e-mail:{" "}
          <a
            href={`mailto:${ORG_CONTACT.email}`}
            className="text-indigo-600 underline">
            {ORG_CONTACT.email}
          </a>
          .
        </p>

        <h2>6. Adattovábbítás és harmadik országok</h2>
        <p>
          Egyes szolgáltatók (pl. USA-ban székhelyű felhőszolgáltatók) esetén
          adatok <strong>harmadik országba</strong> történő továbbítása merülhet
          fel. Az ilyen továbbítás jogalapját (pl. megfelelőségi határozat,
          szerződéses záradékok) az adatkezelőnek kell biztosítania, és a vele
          kötött szerződéseknek megfelelően kell dokumentálnia.
        </p>

        <h2>7. Adatfeldolgozók és IT szolgáltatók</h2>
        <p>
          Az alábbi táblázat az alkalmazás által igénybe vett főbb szolgáltatókat
          sorolja fel tájékoztató jelleggel. Az üzemeltetőnek célszerű ezekkel a
          szolgáltatókkal adatfeldolgozói megállapodást (DPA) kötnie, illetve a
          kötelező dokumentációt rendben tartania.
        </p>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-2 font-semibold">Szolgáltató</th>
                <th className="p-2 font-semibold">Szerep</th>
                <th className="p-2 font-semibold">Tájékoztató</th>
              </tr>
            </thead>
            <tbody>
              {DATA_PROCESSORS.map((v) => (
                <tr
                  key={v.name}
                  className="border-b border-gray-100">
                  <td className="p-2 align-top">{v.name}</td>
                  <td className="p-2 align-top">{v.role}</td>
                  <td className="p-2 align-top">
                    <a
                      href={v.privacy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline break-all">
                      {v.privacy}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>8. Cookie-k és helyi tárolók</h2>
        <p>
          A böngészős sütikről és a helyi tárolóról (localStorage) a{" "}
          <Link
            href={LEGAL_ROUTES.cookies}
            className="text-indigo-600 underline">
            cookie tájékoztató
          </Link>{" "}
          rendelkezik részletesen.
        </p>

        <h2>9. Módosítás</h2>
        <p>
          Ezt a tájékoztatót az adatkezelő vagy az alkalmazás funkcióinak
          változása miatt időről időre frissíthetjük. Érdemes időnként
          visszaolvasni; jelentős változásnál – a jogszabályoknak megfelelően –
          külön értesítés is adható.
        </p>
      </LegalProse>
    </PageLayout>
  );
}
