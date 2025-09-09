import { SignIn } from "@clerk/nextjs";
import PageLayout from "@/components/common/PageLayout";

export default function Page() {
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-2 md:mb-10">Belépés</h1>
      <div className="flex items-center justify-center">
        <SignIn />
      </div>
    </PageLayout>
  );
}
