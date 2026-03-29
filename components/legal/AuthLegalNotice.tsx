import Link from "next/link";
import { LEGAL_ROUTES } from "@/constants/legalRoutes";

export function AuthLegalNotice() {
  return (
    <p className="mt-4 max-w-lg text-center text-sm text-gray-600">
      A belépéssel / regisztrációval elfogadod az{" "}
      <Link
        href={LEGAL_ROUTES.terms}
        className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800">
        Általános Szerződési Feltételeket
      </Link>{" "}
      és az{" "}
      <Link
        href={LEGAL_ROUTES.privacy}
        className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800">
        adatkezelési tájékoztatót
      </Link>
      . A szövegeket jogász érdemes véglegesítenie.
    </p>
  );
}
