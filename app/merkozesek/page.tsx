import { Suspense } from "react";
import MatchListTable from "@/components/MatchListTable";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
import Skeleton from "@/components/common/Skeleton";

export const dynamic = "force-dynamic";

const MatchesPage = () => {
  return (
    <PageLayout>
      <PageTitle title="Mérkőzések" />
      <Suspense
        fallback={
          <div className="space-y-2">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
          </div>
        }
      >
        <MatchListTable />
      </Suspense>
    </PageLayout>
  );
};

export default MatchesPage;
