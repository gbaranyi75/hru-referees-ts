import { Suspense } from "react";
import { MatchListTable } from "@/components/matches";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";

export const dynamic = "force-dynamic";

const MatchesPage = () => {
  return (
    <PageLayout>
      <PageTitle title="Mérkőzések" />
      <Suspense
        fallback={null}
      >
        <MatchListTable />
      </Suspense>
    </PageLayout>
  );
};

export default MatchesPage;
