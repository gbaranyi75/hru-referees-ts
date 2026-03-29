/** Központi elérhetőségek (kapcsolat oldal, jogi dokumentumok) */
export const ORG_CONTACT = {
  phone: "+36304146068",
  email: "rugbyreferee.hungary@gmail.com",
} as const;

/**
 * Tranzakciós e-mail „Feladó” megjelenítése (Resend), egyezik az API route-tal.
 * @see app/api/send-email/route.ts
 */
export const RESEND_FROM_DISPLAY =
  "MRGSZ Játékvezetői Bizottság <info@hru-referees.hu>";
