# Strukturális fejlesztési javaslatok

## Mi lett most javítva

- A `UsersContext`, `GuestUsersContext` és `ClerkUsersContext` fájlokban azonos adatbetöltési logika volt.
- Ezt egységesítettem a `useRefreshableResource` hookkal, így kevesebb a duplikáció és kisebb a regressziók esélye.
- A `GuestUsersContext` duplán futtatott kezdeti betöltését (két `useEffect`) megszüntettem.

## További strukturális javaslatok

1. **Server Action válaszok egységesítése**
   - Érdemes lenne közös `ActionResult<T>` típust használni minden `lib/actions/*` fájlban.
   - Ezzel egyszerűsödik a kliens oldali hibakezelés és a generic hookok használata.

2. **Context provider réteg csökkentése**
   - Több lista jellegű állapotot most Context kezel.
   - Ha központi cache szükséges, érdemes lehet fokozatosan React Query-re (már dependency-ben ott van) átállni; így kevesebb saját újratöltési logika kell.

3. **Domain szerinti modulstruktúra**
   - A `components/` mappa erősen lapos.
   - Jobb áttekinthetőséghez javasolt pl. `components/matches/*`, `components/users/*`, `components/media/*` bontás.

4. **Közös hibaszótár i18n előkészítéshez**
   - Több helyen azonos magyar hibaüzenet stringek szerepelnek.
   - Egy `constants/messages.ts` (vagy i18n provider) csökkenti a string duplikációt.

5. **Űrlap és validáció különválasztás**
   - Ahol UI és validáció erősen összekapcsolt, javasolt a Zod sémák központi domain mappákba mozgatása (`lib/validation/*`).
   - Ez jobban támogatja a szerver/kliens közös felhasználást és a tesztelhetőséget.
