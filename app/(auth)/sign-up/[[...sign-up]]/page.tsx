import { SignUp } from "@clerk/nextjs";
import PageLayout from "@/components/common/PageLayout";
import { AuthLegalNotice } from "@/components/legal/AuthLegalNotice";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-2 md:mb-10">Regisztráció</h1>
      <div className="flex flex-col items-center justify-center">
        <SignUp />
        <AuthLegalNotice />
      </div>
    </PageLayout>
  );
}
