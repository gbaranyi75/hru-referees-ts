import type { Metadata } from "next";
import PageLayout from "@/components/common/PageLayout";
import { LegalProse } from "@/components/legal/LegalProse";
import { LegalDisclaimer } from "@/components/legal/LegalDisclaimer";
import Link from "next/link";
import { LEGAL_ROUTES } from "@/constants/legalRoutes";
import { ORG_CONTACT } from "@/constants/contact";

export const metadata: Metadata = {
  title: "Általános Szerződési Feltételek | HRU Referees",
  description: "ÁSZF – HRU Referees",
};

export default function AszfPage() {
  return (
    <PageLayout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Általános Szerződési Feltételek (ÁSZF)
      </h1>
      <LegalProse>
        <LegalDisclaimer />

        <h2>1. A szolgáltatás és a szerződő felek</h2>
        <p>
          Jelen Általános Szerződési Feltételek (ÁSZF) a <strong>HRU Referees</strong>{" "}
          megnevezésű webes alkalmazás (a továbbiakban: <strong>Szolgáltatás</strong>)
          igénybevételére vonatkoznak. A Szolgáltatást a Magyar Rögbi Szövetség
          Játékvezetői Bizottságának tevékenységéhez kapcsolódóan az üzemeltető
          biztosítja a játékvezetői adminisztráció (mérkőzések, elérhetőségek,
          dokumentumok, profilok stb.) támogatására.
        </p>
        <p>
          A Szolgáltatást igénybe vevő természetes személy a továbbiakban{" "}
          <strong>Felhasználó</strong>. A Felhasználó a regisztrációval / belépéssel
          elfogadja jelen ÁSZF-et és az{" "}
          <Link
            href={LEGAL_ROUTES.privacy}
            className="text-indigo-600 underline">
            adatkezelési tájékoztatót
          </Link>
          .
        </p>
        <p>
          <strong>Szolgáltató (kitöltendő):</strong> a Szolgáltatást nyújtó jogi
          személy vagy szervezet teljes megnevezése, székhelye és elérhetősége –
          jogi zárórendelkezés számára. Általános kapcsolat:{" "}
          <a
            href={`mailto:${ORG_CONTACT.email}`}
            className="text-indigo-600 underline">
            {ORG_CONTACT.email}
          </a>
          .
        </p>

        <h2>2. Regisztráció, belépés és fiók jóváhagyása</h2>
        <p>
          A belépéshez külső hitelesítési szolgáltató (Clerk) vehető igénybe. A
          Felhasználó köteles valós adatokat megadni, és felelős a fiókja
          biztonságáért (jelszó, eszközök). Az alkalmazásban a{" "}
          <strong>jóváhagyás</strong> (approved) és az{" "}
          <strong>adminisztrátori szerepkör</strong> (role) beállítása az üzemeltető
          / jogosult adminisztrátor hatáskörébe tartozik; a jóváhagyás nélkül egyes
          funkciók nem elérhetők.
        </p>
        <p>
          Az üzemeltető jogosult a Felhasználó hozzáférését felfüggeszteni vagy
          megszüntetni, ha a Felhasználó megsérti jelen ÁSZF-et, jogszabályt
          sért, vagy a Szolgáltatás biztonságát veszélyezteti – a konkrét
          eljárásrend <strong>szervezeti döntés szerint kitöltendő</strong>.
        </p>

        <h2>3. A Szolgáltatás tartalma</h2>
        <p>
          A Szolgáltatás funkciói (mérkőzéslista, kijelölések, dokumentumok,
          média, profil, kapcsolatfelvétel stb.) az alkalmazás aktuális verziója
          szerint változhatnak. Az üzemeltető törekszik a rendelkezésre állásra,
          de a Szolgáltatást <strong>„ahogy van”</strong> alapon nyújtja, különösen
          karbantartás, frissítés vagy harmadik féltől függő szolgáltatások
          esetén.
        </p>

        <h2>4. Felhasználói magatartás</h2>
        <p>A Felhasználó különösen köteles:</p>
        <ul>
          <li>
            nem használni a Szolgáltatást jogellenes célra, mások zaklatására vagy
            megtévesztésére;
          </li>
          <li>
            nem megkerülni a hozzáférési szabályokat, nem próbálni jogosulatlan
            adatokhoz hozzáférni;
          </li>
          <li>
            nem terhelni a rendszert automatizált eszközökkel abban a mértékben,
            amely a Szolgáltatás működését veszélyezteti;
          </li>
          <li>
            tiszteletben tartani más játékvezetők és üzemeltetői személyzet
            jogait és a sportág szabályait – a részletes magatartási szabályok{" "}
            <strong>szervezeti utasítás szerint kiegészíthetők</strong>.
          </li>
        </ul>

        <h2>5. Adminisztrációs jogok</h2>
        <p>
          Az <strong>adminisztrátori</strong> szerepkörrel rendelkező felhasználók
          a rendszer beállításai szerint szélesebb körű adatokhoz férhetnek hozzá
          (például mérkőzés- és felhasználói adatok kezelése). Az adminisztrátorok
          kötelesek a személyes adatokat csak a szükséges mértékben és az
          adatkezelési tájékoztatónak megfelelően kezelni.
        </p>

        <h2>6. Szellemi alkotások és tartalom</h2>
        <p>
          Az alkalmazás felülete, kódja és megjelenése az üzemeltető vagy
          jogosult harmadik felek jogvédelme alá eshet. A Felhasználó által
          feltöltött tartalomért a Felhasználó felel; a feltöltéssel nem
          sérthetők harmadik személyek jogai.
        </p>

        <h2>7. Felelősség korlátozása</h2>
        <p>
          A Szolgáltatás használatából eredő közvetett vagy következménykárokra
          vonatkozó felelősség korlátozása, valamint a szolgáltatás megszűnéséből
          eredő igények – <strong>jogi egyeztetés és magyar jog szerinti végleges
          megfogalmazás szükséges</strong>. A Felhasználó saját felelősségére
          használja a Szolgáltatást.
        </p>

        <h2>8. Adatvédelem</h2>
        <p>
          A személyes adatok kezelését az{" "}
          <Link
            href={LEGAL_ROUTES.privacy}
            className="text-indigo-600 underline">
            adatkezelési tájékoztató
          </Link>{" "}
          szabályozza.
        </p>

        <h2>9. Irányadó jog és vitarendezés</h2>
        <p>
          Jelen ÁSZF-re – ha a jogszabály másként nem rendelkezik – a{" "}
          <strong>magyar jog</strong> az irányadó. A felek vitás kérdéseiket
          elsősorban békés úton rendezik; peres eljárás illetékessége –{" "}
          <strong>kitöltendő jogászi megfogalmazással</strong>.
        </p>

        <h2>10. Hatály és módosítás</h2>
        <p>
          Az üzemeltető jogosult az ÁSZF egyoldalú módosítására; a módosításról
          ésszerű módon (pl. webes közzététel) tájékoztatja a Felhasználókat. A
          Szolgáltatás további használata a módosítás közzététele után az új
          feltételek elfogadásának minősülhet – a pontos mechanizmus{" "}
          <strong>jogi felülvizsgálattal rögzítendő</strong>.
        </p>
      </LegalProse>
    </PageLayout>
  );
}
