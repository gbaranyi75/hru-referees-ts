import { AddMatchDays } from "@/components/availabilty";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
export const dynamic = "force-dynamic";

const MatchDaysPage = () => {
  return (
    <PageLayout>
      <PageTitle title="Elérhetőség megadása" />
      <AddMatchDays />
    </PageLayout>
  );
};

export default MatchDaysPage;
