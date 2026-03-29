import { SignIn } from "@clerk/nextjs";
import PageLayout from "@/components/common/PageLayout";
import { AuthLegalNotice } from "@/components/legal/AuthLegalNotice";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-2 md:mb-10">Belépés</h1>
      <div className="flex flex-col items-center justify-center">
        <SignIn />
        <AuthLegalNotice />
      </div>
    </PageLayout>
  );
}
